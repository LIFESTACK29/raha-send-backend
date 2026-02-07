import {
  Controller,
  Get,
  Post,
  Patch,
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
import { UpdateAddressDto } from '@app/address/dto/update-address.dto';
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
  @ApiOperation({
    summary: 'Create Address',
    description: 'Creates a new address for the authenticated user. Access: API Key required.',
  })
  @ApiResponse({
    status: 201,
    description: 'Address created successfully.',
  })
  createAddress(@Req() req, @Body() dto: CreateAddressDto) {
    return this.addressService.create(dto);
  }

  @Get('addresses')
  @ApiOperation({
    summary: 'Get all addresses',
    description: 'Retrieves all addresses associated with the authenticated user. Access: API Key required.',
  })
  @ApiResponse({
    status: 200,
    description: 'Addresses retrieved successfully.',
  })
  getAddresses(@Req() req) {
    return this.addressService.findAll();
  }

  @Get('addresses/:addressId')
  @ApiOperation({
    summary: 'Get address by ID',
    description: 'Retrieves a specific address by its addressId. Access: API Key required.',
  })
  @ApiResponse({
    status: 200,
    description: 'Address retrieved successfully.',
  })
  @ApiResponse({ status: 404, description: 'Address not found.' })
  getAddressById(@Req() req, @Param('addressId') addressId: string) {
    return this.addressService.findOne(addressId);
  }

  @Patch('addresses/:addressId')
  @ApiOperation({
    summary: 'Update address',
    description: 'Updates a specific address by its addressId. Access: API Key required.',
  })
  @ApiResponse({
    status: 200,
    description: 'Address updated successfully.',
  })
  @ApiResponse({ status: 404, description: 'Address not found.' })
  updateAddress(
    @Req() req,
    @Param('addressId') addressId: string,
    @Body() updateAddressDto: UpdateAddressDto,
  ) {
    return this.addressService.update(addressId, updateAddressDto);
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
