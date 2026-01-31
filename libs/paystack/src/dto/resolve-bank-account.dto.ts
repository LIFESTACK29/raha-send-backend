import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ResolveBankAccountDto {
    @ApiProperty({
        example: '0022728151',
        description: "Customer's bank account number to resolve",
    })
    @IsString()
    @IsNotEmpty()
    account_number: string;

    @ApiProperty({
        example: '063',
        description: "Customer's bank code",
    })
    @IsString()
    @IsNotEmpty()
    bank_code: string;
}
