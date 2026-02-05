import { ApiProperty } from '@nestjs/swagger';
import {
    IsBoolean,
    IsEmail,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsNumber,
} from 'class-validator';

export class CreateAddressDto {
    @ApiProperty({ example: 'Lagos', description: 'Address city' })
    @IsString()
    @IsNotEmpty()
    city: string;

    @ApiProperty({ example: 'Lagos', description: 'Address state' })
    @IsString()
    @IsNotEmpty()
    state: string;

    @ApiProperty({ example: 'NG', description: 'ISO 2 country code' })
    @IsString()
    @IsNotEmpty()
    country: string;

    @ApiProperty({ example: '123 Main St', description: 'Street address' })
    @IsString()
    @IsNotEmpty()
    line1: string;

    @ApiProperty({
        example: 'Apt 4B',
        description: 'Second line of street address',
        required: false,
    })
    @IsString()
    @IsOptional()
    line2?: string;

    @ApiProperty({ example: '100001', description: 'Zip / Postal code' })
    @IsString()
    @IsNotEmpty()
    zip: string;

    @ApiProperty({ example: '+2348012345678', description: 'Phone number' })
    @IsString()
    @IsNotEmpty()
    phone: string;

    @ApiProperty({
        example: 'john.doe@example.com',
        description: 'Email of person at address',
        required: false,
    })
    @IsEmail()
    @IsOptional()
    email?: string;

    @ApiProperty({ example: 'John Doe', description: 'Full name of person' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        example: true,
        description: 'Is residential address',
        required: false,
        default: true,
    })
    @IsBoolean()
    @IsOptional()
    is_residential?: boolean;

    @ApiProperty({
        example: { key: 'value' },
        description: 'Additional metadata',
        required: false,
    })
    @IsOptional()
    metadata?: any;

    @ApiProperty({ example: 6.5244, description: 'Address latitude', required: true })
    @IsNumber()
    @IsNotEmpty()
    latitude: number;

    @ApiProperty({ example: 3.3792, description: 'Address longitude', required: true })
    @IsNumber()
    @IsNotEmpty()
    longitude: number;
}
