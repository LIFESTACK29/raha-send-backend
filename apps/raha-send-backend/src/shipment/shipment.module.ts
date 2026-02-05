import { Module } from '@nestjs/common';
import { ShipmentModule as LibShipmentModule } from '@app/shipment';
import { ShipmentController } from './shipment.controller';
import { AdminShipmentController } from './admin-shipment.controller';

@Module({
    imports: [LibShipmentModule],
    controllers: [ShipmentController, AdminShipmentController],
    exports: [LibShipmentModule],
})
export class ShipmentModule { }
