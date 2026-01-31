import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
    Parcel,
    Shipment,
    ShipmentStatus,
    PaymentStatus,
    Address,
    User,
} from '@app/common';
import { CreateParcelDto } from './dto/create-parcel.dto';
import { CreateShipmentDto, GetRateDto } from './dto/create-shipment.dto';
import { WalletService } from '../wallet/wallet.service';
import * as crypto from 'crypto';

@Injectable()
export class ShipmentService {
    constructor(
        @InjectModel(Parcel.name) private parcelModel: Model<Parcel>,
        @InjectModel(Shipment.name) private shipmentModel: Model<Shipment>,
        @InjectModel(Address.name) private addressModel: Model<Address>,
        @InjectModel(User.name) private userModel: Model<User>,
        private readonly walletService: WalletService,
    ) { }

    private generateId(prefix: string): string {
        return prefix + '_' + crypto.randomBytes(12).toString('hex');
    }

    async createParcel(userId: string, createParcelDto: CreateParcelDto) {
        const user = await this.userModel.findById(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        const parcel = new this.parcelModel({
            ...createParcelDto,
            userId: user._id,
            parcelId: this.generateId('parc'),
        });

        return parcel.save();
    }

    // Haversine formula to calculate distance in km
    private calculateDistance(
        lat1: number,
        lon1: number,
        lat2: number,
        lon2: number,
    ): number {
        const R = 6371; // Radius of the earth in km
        const dLat = this.deg2rad(lat2 - lat1);
        const dLon = this.deg2rad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.deg2rad(lat1)) *
            Math.cos(this.deg2rad(lat2)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const d = R * c; // Distance in km
        return parseFloat(d.toFixed(2));
    }

    private deg2rad(deg: number): number {
        return deg * (Math.PI / 180);
    }

    async getRate(getRateDto: GetRateDto) {
        const pickup = await this.addressModel.findOne({
            addressId: getRateDto.pickupAddressId,
        });
        const delivery = await this.addressModel.findOne({
            addressId: getRateDto.deliveryAddressId,
        });

        if (!pickup || !delivery) {
            throw new NotFoundException('Pickup or Delivery address not found');
        }

        if (
            pickup.latitude == null ||
            pickup.longitude == null ||
            delivery.latitude == null ||
            delivery.longitude == null
        ) {
            throw new BadRequestException(
                'Address coordinates missing. Cannot calculate rate.',
            );
        }

        const distance = this.calculateDistance(
            pickup.latitude,
            pickup.longitude,
            delivery.latitude,
            delivery.longitude,
        );

        // Pricing Formula: Base Fare (1000) + (Distance * 200)
        const baseFare = 1000;
        const ratePerKm = 200;
        const price = baseFare + distance * ratePerKm;

        // Ensure integer for kobo/naira logic, assume standard is kobo?
        // User said "Base fare is 1k". Usually means 1000 Naira.
        // "Rate per km is 200 naira".
        // 1000 Naira = 100000 kobo.
        // 200 Naira = 20000 kobo.
        // BUT wallet balance is usually in kobo (Paystack standard).
        // Let's assume user inputs are in NAIRA as they stated "1k" and "200 naira".
        // So calculation result is in NAIRA.
        // We should convert to KOBO for storage/payment if wallet uses kobo?
        // WalletService uses kobo (50000 example = 500 Naira).
        // Wait, 50000 kobo = 500 Naira.
        // User said "Base fare is 1k" (1000 Naira).
        // So Base = 100000 kobo.
        // Rate = 20000 kobo/km.

        const priceInKobo = Math.round((baseFare + distance * ratePerKm) * 100);

        return {
            price: priceInKobo,
            distance,
            formattedPrice: priceInKobo / 100,
        };
    }

    async createShipment(userId: string, createShipmentDto: CreateShipmentDto) {
        const user = await this.userModel.findById(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        const parcel = await this.parcelModel.findOne({
            parcelId: createShipmentDto.parcelId,
        });
        if (!parcel) {
            throw new NotFoundException('Parcel not found');
        }

        const pickup = await this.addressModel.findOne({
            addressId: createShipmentDto.pickupAddressId,
        });
        const delivery = await this.addressModel.findOne({
            addressId: createShipmentDto.deliveryAddressId,
        });

        if (!pickup || !delivery) {
            throw new NotFoundException('Pickup or Delivery address not found');
        }

        const rate = await this.getRate({
            pickupAddressId: createShipmentDto.pickupAddressId,
            deliveryAddressId: createShipmentDto.deliveryAddressId,
        });

        const shipment = new this.shipmentModel({
            userId: user._id,
            parcelId: parcel._id,
            pickupAddressId: pickup._id,
            deliveryAddressId: delivery._id,
            shipmentId: this.generateId('ship'),
            status: ShipmentStatus.DRAFT,
            price: rate.price,
            distance: rate.distance,
            paymentStatus: PaymentStatus.PENDING,
        });

        return shipment.save();
    }

    async  bookShipment(userId: string, shipmentId: string) {
        const user = await this.userModel.findById(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        const shipment = await this.shipmentModel.findOne({
            shipmentId,
            userId: user._id,
        });

        if (!shipment) {
            throw new NotFoundException('Shipment not found');
        }

        if (shipment.paymentStatus === PaymentStatus.PAID) {
            throw new BadRequestException('Shipment is already paid for');
        }

        // Deduct from wallet
        await this.walletService.deductBalance(userId, shipment.price);

        shipment.paymentStatus = PaymentStatus.PAID;
        shipment.status = ShipmentStatus.PICKUP_SCHEDULED; // Or CREATED
        await shipment.save();

        return {
            message: 'Shipment booked successfully',
            shipment,
        };
    }

    async findAll(userId: string) {
        const user = await this.userModel.findById(userId);
        if (!user) return [];
        return this.shipmentModel.find({ userId: user._id }).exec();
    }

    async findOne(userId: string, shipmentId: string) {
        const user = await this.userModel.findById(userId);
        if (!user) throw new NotFoundException('User not found');
        return this.shipmentModel.findOne({ userId: user._id, shipmentId }).exec();
    }
}
