import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ShipmentService } from './shipment.service';
import {
    Parcel,
    ParcelSchema,
    Shipment,
    ShipmentSchema,
    User,
    UserSchema,
    Address,
    AddressSchema,
} from '@app/common';
import { WalletModule } from '@app/wallet';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Parcel.name, schema: ParcelSchema },
            { name: Shipment.name, schema: ShipmentSchema },
            { name: User.name, schema: UserSchema },
            { name: Address.name, schema: AddressSchema },
        ]),
        WalletModule,
    ],
    providers: [ShipmentService],
    exports: [ShipmentService],
})
export class ShipmentModule { }
