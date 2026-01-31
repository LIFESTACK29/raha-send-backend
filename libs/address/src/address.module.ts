import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AddressService } from './address.service';
import { Address, AddressSchema } from '@app/common';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Address.name, schema: AddressSchema },
        ]),
    ],
    providers: [AddressService],
    exports: [AddressService],
})
export class AddressModule { }
