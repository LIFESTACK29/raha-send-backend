import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RiderService } from './rider.service';
import { RiderController } from './rider.controller';
import { Rider, RiderSchema } from '@app/common';
import { Vehicle, VehicleSchema } from './vehicle.schema';
import { StorageModule } from '../../storage/storage.module';
import { ShipmentModule } from '../../shipment/shipment.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Rider.name, schema: RiderSchema },
      { name: Vehicle.name, schema: VehicleSchema },
    ]),
    StorageModule,
    ShipmentModule,
  ],
  providers: [RiderService],
  controllers: [RiderController],
  exports: [RiderService],
})
export class RiderModule { }
