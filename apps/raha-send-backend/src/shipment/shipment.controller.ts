import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Patch,
    Req,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
} from '@nestjs/swagger';
import { ShipmentService } from '@app/shipment';
import { CreateParcelDto } from '@app/shipment/dto/create-parcel.dto';
import { CreateShipmentDto, GetRateDto } from '@app/shipment/dto/create-shipment.dto';
import { ShipmentRateResponseDto } from '@app/shipment/dto/shipment-response.dto';

@ApiTags('Shipment & Parcel')
@ApiBearerAuth()
@Controller()
export class ShipmentController {
    constructor(private readonly shipmentService: ShipmentService) { }

    @Post('parcels')
    @ApiOperation({
        summary: 'Create Parcel',
        description: 'Create a new parcel with dimensions and items.',
    })
    createParcel(@Req() req, @Body() createParcelDto: CreateParcelDto) {
        return this.shipmentService.createParcel(req.user.sub, createParcelDto);
    }

    @Post('shipments/rates')
    @ApiOperation({
        summary: 'Get Shipment Rates',
        description: 'Calculate shipping cost based on pickup and delivery addresses.',
    })
    @ApiResponse({
        status: 200,
        type: ShipmentRateResponseDto,
    })
    getRate(@Body() getRateDto: GetRateDto) {
        return this.shipmentService.getRate(getRateDto);
    }

    @Post('shipments')
    @ApiOperation({
        summary: 'Create Shipment (Draft)',
        description: 'Create a shipment draft.',
    })
    createShipment(@Req() req, @Body() createShipmentDto: CreateShipmentDto) {
        return this.shipmentService.createShipment(req.user.sub, createShipmentDto);
    }

    @Post('shipments/:id/book')
    @ApiOperation({
        summary: 'Book Shipment',
        description: 'Finalize shipment, deduct wallet balance, and schedule pickup.',
    })
    bookShipment(@Req() req, @Param('id') shipmentId: string) {
        return this.shipmentService.bookShipment(req.user.sub, shipmentId);
    }

    @Patch('shipments/:id/assign')
    @ApiOperation({
        summary: 'Assign Rider to Shipment',
        description: 'Admin assigns a rider to a shipment.',
    })
    assignRider(@Param('id') shipmentId: string, @Body('riderId') riderId: string) {
        // In real app, check if req.user is ADMIN
        return this.shipmentService.assignRider(shipmentId, riderId);
    }

    @Get('shipments')
    @ApiOperation({ summary: 'Get all shipments' })
    findAll(@Req() req) {
        return this.shipmentService.findAll(req.user.sub);
    }

    @Get('shipments/:id')
    @ApiOperation({ summary: 'Get shipment by ID' })
    findOne(@Req() req, @Param('id') shipmentId: string) {
        return this.shipmentService.findOne(req.user.sub, shipmentId);
    }
}
