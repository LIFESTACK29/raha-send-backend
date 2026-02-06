import {
  IsEmail,
  IsString,
  IsPhoneNumber,
  IsDateString,
  IsEnum,
  ValidateNested,
  IsNotEmpty,
  IsOptional,
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

/**
 * DTO for riders to update their own profile.
 * Access: Rider only (authenticated rider can only update their own profile)
 * Allowed fields: email, phone, profileImage
 */
export class RiderSelfUpdateDto {
  @ApiProperty({
    example: 'newemail@example.com',
    description: 'Updated email address (must be unique)',
    required: false,
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({
    example: '+1234567890',
    description: 'Updated phone number (must be unique)',
    required: false,
  })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Profile photo upload (multipart/form-data)',
    required: false,
  })
  @IsOptional()
  profileImage?: any;
}

/**
 * DTO for admins to update rider details.
 * Access: Admin only (can update any rider's profile)
 * Allowed fields: All rider profile fields including isActive and status
 */
export class AdminUpdateRiderDto {
  @ApiProperty({
    example: 'newemail@example.com',
    description: 'Updated email address (must be unique)',
    required: false,
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ example: 'John', description: 'Rider first name', required: false })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiProperty({ example: 'Doe', description: 'Rider last name', required: false })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiProperty({
    example: 'Male',
    description: 'Rider sex/gender',
    enum: ['Male', 'Female', 'Other'],
    required: false,
  })
  @IsString()
  @IsOptional()
  sex?: string;

  @ApiProperty({ example: '1990-01-01', description: 'Rider date of birth (ISO 8601)', required: false })
  @IsDateString()
  @IsOptional()
  dateOfBirth?: string;

  @ApiProperty({
    example: '+1234567890',
    description: 'Updated phone number (must be unique)',
    required: false,
  })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({
    example: true,
    description: 'Activate or deactivate the rider account',
    required: false,
  })
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({
    example: 'IDLE',
    description: 'Rider availability status',
    enum: ['IDLE', 'BUSY', 'OFFLINE'],
    required: false,
  })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Profile photo upload (multipart/form-data)',
    required: false,
  })
  @IsOptional()
  profileImage?: any;
}
