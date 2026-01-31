import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class AssignAccountDto {
  @ApiProperty({
    example: 'janedoe@test.com',
    description: 'User email address',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'Jane',
    description: 'User first name',
  })
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @ApiProperty({
    example: 'Karen',
    description: 'User middle name',
    required: false,
  })
  @IsString()
  @IsOptional()
  middle_name?: string;

  @ApiProperty({
    example: 'Doe',
    description: 'User last name',
  })
  @IsString()
  @IsNotEmpty()
  last_name: string;

  @ApiProperty({
    example: '+2348100000000',
    description: 'User phone number',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\+?[1-9]\d{1,14}$/, {
    message: 'Phone number must be a valid international format',
  })
  phone: string;

  @ApiProperty({
    example: 'test-bank',
    description: 'Preferred bank',
  })
  @IsString()
  @IsNotEmpty()
  preferred_bank: string;

  @ApiProperty({
    example: 'NG',
    description: 'Country code',
  })
  @IsString()
  @IsNotEmpty()
  country: string;

  @ApiProperty({
    example: '0123456789',
    description: 'Bank account number',
  })
  @IsString()
  @IsNotEmpty()
  account_number: string;

  @ApiProperty({
    example: '20012345678',
    description: 'Bank Verification Number (BVN)',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{11}$/, {
    message: 'BVN must be exactly 11 digits',
  })
  bvn: string;

  @ApiProperty({
    example: '007',
    description: 'Bank code',
  })
  @IsString()
  @IsNotEmpty()
  bank_code: string;
}