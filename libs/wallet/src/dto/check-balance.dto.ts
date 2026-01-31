import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CheckBalanceDto {
    @ApiProperty({
        example: 5000,
        description: 'Ride fee amount in kobo (100 kobo = 1 Naira)',
    })
    @IsNumber()
    @IsNotEmpty()
    @Min(100, { message: 'Minimum amount is 100 kobo (1 Naira)' })
    amount: number;
}
