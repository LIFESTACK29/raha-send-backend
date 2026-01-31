import { Module } from '@nestjs/common';
import { AddressModule as LibAddressModule } from '@app/address';
import { AddressController } from './address.controller';

@Module({
    imports: [LibAddressModule],
    controllers: [AddressController],
})
export class AddressModule { }
