import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Address } from '@app/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import * as crypto from 'crypto';

@Injectable()
export class AddressService {
    constructor(
        @InjectModel(Address.name) private addressModel: Model<Address>,
    ) { }

    private generateAddressId(): string {
        return 'addr_' + crypto.randomBytes(12).toString('hex');
    }

    async create(createAddressDto: CreateAddressDto) {
        const address = new this.addressModel({
            ...createAddressDto,
            addressId: this.generateAddressId(),
        });

        return address.save();
    }

    async findAll() {
        return this.addressModel.find().exec();
    }

    async findOne(addressId: string) {
        const address = await this.addressModel.findOne({
            addressId,
        });

        if (!address) {
            throw new NotFoundException('Address not found');
        }

        return address;
    }

    async update(addressId: string, updateAddressDto: UpdateAddressDto) {
        const address = await this.addressModel.findOneAndUpdate(
            { addressId },
            { $set: updateAddressDto },
            { new: true },
        );

        if (!address) {
            throw new NotFoundException('Address not found');
        }

        return address;
    }

    async remove(addressId: string) {
        const result = await this.addressModel.deleteOne({
            addressId,
        });

        if (result.deletedCount === 0) {
            throw new NotFoundException('Address not found');
        }

        return { message: 'Address deleted successfully' };
    }
}
