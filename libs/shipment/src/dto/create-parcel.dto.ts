import { ApiProperty } from '@nestjs/swagger';
import {
    IsArray,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ParcelItemDto {
    @ApiProperty({ example: 'Laptop' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: 1 })
    @IsNumber()
    @IsNotEmpty()
    quantity: number;

    @ApiProperty({ example: 150000 })
    @IsNumber()
    @IsNotEmpty()
    value: number;

    @ApiProperty({ example: 'Electronics' })
    @IsString()
    @IsOptional()
    category: string;
}

export class CreateParcelDto {
    @ApiProperty({ example: 2.5, description: 'Weight in kg' })
    @IsNumber()
    @IsNotEmpty()
    weight: number;

    @ApiProperty({ example: 10, required: false })
    @IsNumber()
    @IsOptional()
    height?: number;

    @ApiProperty({ example: 20, required: false })
    @IsNumber()
    @IsOptional()
    width?: number;

    @ApiProperty({ example: 30, required: false })
    @IsNumber()
    @IsOptional()
    length?: number;

    @ApiProperty({ example: 'Box of electronics', required: false })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({ type: [ParcelItemDto] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ParcelItemDto)
    items: ParcelItemDto[];

    @ApiProperty({ example: {}, required: false })
    @IsOptional()
    metadata?: any;
}
