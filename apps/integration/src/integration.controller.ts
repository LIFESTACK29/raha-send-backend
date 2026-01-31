import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { IntegrationService } from './integration.service';
import { ApiKeyGuard } from './guards/api-key.guard';
import { AddressService } from '@app/address';
import { ShipmentService } from '@app/shipment';
import { CreateAddressDto } from '@app/address/dto/create-address.dto';
import { CreateParcelDto } from '@app/shipment/dto/create-parcel.dto';
import { CreateShipmentDto, GetRateDto } from '@app/shipment/dto/create-shipment.dto';

@ApiTags('Integration')
@ApiBearerAuth()
@UseGuards(ApiKeyGuard)
@Controller()
export class IntegrationController {
  constructor(
    private readonly integrationService: IntegrationService,
    private readonly addressService: AddressService,
    private readonly shipmentService: ShipmentService,
  ) { }

  @Get()
  getHello(@Req() req): string {
    return `Hello ${req.user.firstName}! You are in ${req.mode} mode.`;
  }

  // Address Endpoints
  @Post('addresses')
  @ApiOperation({ summary: 'Create Address' })
  createAddress(@Req() req, @Body() dto: CreateAddressDto) {
    return this.addressService.create(dto);
  }

  @Get('addresses')
  @ApiOperation({ summary: 'Get Addresses' })
  getAddresses(@Req() req) {
    return this.addressService.findAll();
  }

  // Shipment Endpoints
  @Post('parcels')
  @ApiOperation({ summary: 'Create Parcel' })
  createParcel(@Req() req, @Body() dto: CreateParcelDto) {
    return this.shipmentService.createParcel(req.user._id.toString(), dto);
  }

  @Post('shipments/rates')
  @ApiOperation({ summary: 'Get Rates' })
  getRate(@Body() dto: GetRateDto) {
    return this.shipmentService.getRate(dto);
  }

  @Post('shipments')
  @ApiOperation({ summary: 'Create Shipment' })
  createShipment(@Req() req, @Body() dto: CreateShipmentDto) {
    return this.shipmentService.createShipment(req.user._id.toString(), dto);
  }

  @Post('shipments/:id/book')
  @ApiOperation({ summary: 'Book Shipment' })
  bookShipment(@Req() req, @Param('id') id: string) {
    return this.shipmentService.bookShipment(req.user._id.toString(), id);
  }
}
