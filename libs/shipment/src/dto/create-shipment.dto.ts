import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateShipmentDto {
    @ApiProperty({
        example: 'parcel_123',
        description: 'ID of the parcel to ship',
    })
    @IsString()
    @IsNotEmpty()
    parcelId: string;

    @ApiProperty({
        example: 'addr_pickup123',
        description: 'ID of the pickup address',
    })
    @IsString()
    @IsNotEmpty()
    pickupAddressId: string;

    @ApiProperty({
        example: 'addr_delivery456',
        description: 'ID of the delivery address',
    })
    @IsString()
    @IsNotEmpty()
    deliveryAddressId: string;
}

export class GetRateDto {
    @ApiProperty({
        example: 'addr_pickup123',
        description: 'ID of the pickup address',
    })
    @IsString()
    @IsNotEmpty()
    pickupAddressId: string;

    @ApiProperty({
        example: 'addr_delivery456',
        description: 'ID of the delivery address',
    })
    @IsString()
    @IsNotEmpty()
    deliveryAddressId: string;
}
