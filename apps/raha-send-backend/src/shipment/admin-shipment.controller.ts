import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ShipmentService } from '@app/shipment';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { AdminGuard } from '../auth/guards/admin.guard';

@ApiTags('Admin')
@Controller('admin/shipments')
@UseGuards(JwtGuard, AdminGuard)
@ApiBearerAuth()
export class AdminShipmentController {
    constructor(private readonly shipmentService: ShipmentService) { }

    @Get()
    @ApiOperation({ summary: 'Get ALL shipments (Admin only)' })
    findAll() {
        return this.shipmentService.findAllAdmin();
    }
}
