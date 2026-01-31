import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
} from '@nestjs/swagger';
import { AddressService } from '@app/address';
import { CreateAddressDto } from '@app/address/dto/create-address.dto';
import { UpdateAddressDto } from '@app/address/dto/update-address.dto';
import { AddressResponseDto } from '@app/address/dto/address-response.dto';

@ApiTags('Address')
@ApiBearerAuth()
@Controller('address')
export class AddressController {
    constructor(private readonly addressService: AddressService) { }

    @Post()
    @ApiOperation({
        summary: 'Create new address',
        description: 'Creates a new address.',
    })
    @ApiResponse({
        status: 201,
        description: 'Address created successfully.',
        type: AddressResponseDto,
    })
    create(@Body() createAddressDto: CreateAddressDto) {
        return this.addressService.create(createAddressDto);
    }

    @Get()
    @ApiOperation({
        summary: 'Get all addresses',
        description: 'Retrieves all addresses in the system.',
    })
    @ApiResponse({
        status: 200,
        description: 'Addresses retrieved successfully.',
        type: [AddressResponseDto],
    })
    findAll() {
        return this.addressService.findAll();
    }

    @Get(':addressId')
    @ApiOperation({
        summary: 'Get address by ID',
        description: 'Retrieves a specific address by its generated addressId.',
    })
    @ApiResponse({
        status: 200,
        description: 'Address retrieved successfully.',
        type: AddressResponseDto,
    })
    @ApiResponse({ status: 404, description: 'Address not found.' })
    findOne(@Param('addressId') addressId: string) {
        return this.addressService.findOne(addressId);
    }

    @Patch(':addressId')
    @ApiOperation({
        summary: 'Update address',
        description: 'Updates a specific address by its generated addressId.',
    })
    @ApiResponse({
        status: 200,
        description: 'Address updated successfully.',
        type: AddressResponseDto,
    })
    @ApiResponse({ status: 404, description: 'Address not found.' })
    update(
        @Param('addressId') addressId: string,
        @Body() updateAddressDto: UpdateAddressDto,
    ) {
        return this.addressService.update(addressId, updateAddressDto);
    }

    @Delete(':addressId')
    @ApiOperation({
        summary: 'Delete address',
        description: 'Deletes a specific address by its generated addressId.',
    })
    @ApiResponse({
        status: 200,
        description: 'Address deleted successfully.',
    })
    @ApiResponse({ status: 404, description: 'Address not found.' })
    remove(@Param('addressId') addressId: string) {
        return this.addressService.remove(addressId);
    }
}
