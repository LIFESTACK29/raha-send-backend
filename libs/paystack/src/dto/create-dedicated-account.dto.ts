import { ApiProperty } from '@nestjs/swagger';
import {
    IsEmail,
    IsNotEmpty,
    IsString,
    Matches,
} from 'class-validator';

export class CreateDedicatedAccountDto {
    @ApiProperty({
        example: 'janedoe@test.com',
        description: 'Customer email address',
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        example: 'Jane',
        description: "Customer's first name",
    })
    @IsString()
    @IsNotEmpty()
    first_name: string;

    @ApiProperty({
        example: 'Doe',
        description: "Customer's last name",
    })
    @IsString()
    @IsNotEmpty()
    last_name: string;

    @ApiProperty({
        example: '+2348100000000',
        description: "Customer's phone number",
    })
    @IsString()
    @IsNotEmpty()
    @Matches(/^\+?[1-9]\d{1,14}$/, {
        message: 'Phone number must be a valid international format',
    })
    phone: string;

    @ApiProperty({
        example: 'wema-bank',
        description:
            'The bank slug for preferred bank. Use the List Providers endpoint to get available banks.',
    })
    @IsString()
    @IsNotEmpty()
    preferred_bank: string;

    @ApiProperty({
        example: 'NG',
        description: 'Country code. Currently accepts NG and GH only.',
    })
    @IsString()
    @IsNotEmpty()
    country: string;

    @ApiProperty({
        example: '0022728151',
        description: "Customer's bank account number",
    })
    @IsString()
    @IsNotEmpty()
    account_number: string;

    @ApiProperty({
        example: '20012345678',
        description: "Customer's Bank Verification Number (BVN) - Nigeria only",
    })
    @IsString()
    @IsNotEmpty()
    @Matches(/^\d{11}$/, {
        message: 'BVN must be exactly 11 digits',
    })
    bvn: string;

    @ApiProperty({
        example: '063',
        description: "Customer's bank code",
    })
    @IsString()
    @IsNotEmpty()
    bank_code: string;
}
