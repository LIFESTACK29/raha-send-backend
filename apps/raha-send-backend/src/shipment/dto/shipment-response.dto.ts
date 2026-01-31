import { ApiProperty } from '@nestjs/swagger';

export class ShipmentRateResponseDto {
    @ApiProperty({ example: 5000 })
    price: number;

    @ApiProperty({ example: 20 })
    distance: number;
}
