import {
  IsEmail,
  IsString,
  IsPhoneNumber,
  IsDateString,
  IsEnum,
  ValidateNested,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class RiderLoginDto {
  @ApiProperty({
    example: 'rider@example.com',
    description: 'Rider email address',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'Rider password',
  })
  @IsString()
  password: string;
}

export class CreateVehicleDto {
  @ApiProperty({ example: 'Toyota', description: 'Car make' })
  @IsString()
  @IsNotEmpty()
  make: string;

  @ApiProperty({ example: 'Corolla', description: 'Car model' })
  @IsString()
  @IsNotEmpty()
  vehicleModel: string;

  @ApiProperty({ example: 'ABC-123', description: 'Car plate number' })
  @IsString()
  @IsNotEmpty()
  plateNumber: string;

  @ApiProperty({ example: '1234567890ABC', description: 'Car VIN' })
  @IsString()
  @IsNotEmpty()
  vin: string;

  @ApiProperty({ example: 'Blue', description: 'Car color' })
  @IsString()
  @IsNotEmpty()
  color: string;
}

export class CreateRiderDto {
  @ApiProperty({
    example: 'rider@example.com',
    description: 'Rider email address',
  })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'John', description: 'First name' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'Last name' })
  @IsString()
  lastName: string;

  @ApiProperty({
    example: 'Male',
    description: 'Sex',
    enum: ['Male', 'Female', 'Other'],
  })
  @IsString()
  sex: string;

  @ApiProperty({ example: '1990-01-01', description: 'Date of birth' })
  @IsDateString()
  dateOfBirth: string;

  @ApiProperty({
    example: '+1234567890',
    description: 'Rider phone number',
  })
  @IsString()
  phone: string;

  @ApiProperty({ type: CreateVehicleDto })
  // If receiving as separate fields because of multipart/form-data, we might need to handle them differently in Controller
  // For now, let's assume valid nested object or we will construct it in controller
  @ValidateNested()
  @Type(() => CreateVehicleDto)
  vehicle: CreateVehicleDto;
}

export class RiderResponseDto {
  @ApiProperty({
    example: 'Rider registered successfully',
  })
  message: string;

  @ApiProperty()
  data: any;
}
