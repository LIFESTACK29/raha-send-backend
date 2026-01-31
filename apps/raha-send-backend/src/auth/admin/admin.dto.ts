import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AdminLoginDto {
  @ApiProperty({
    example: 'admin@raha.com',
    description: 'Admin email address',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'Admin@123',
    description: 'Admin password (minimum 6 characters)',
  })
  @IsString()
  @MinLength(6)
  password: string;
}

export class CreateAdminDto {
  @ApiProperty({
    example: 'admin@raha.com',
    description: 'Admin email address',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'Admin@123',
    description: 'Admin password (minimum 6 characters)',
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    example: 'Super Admin',
    description: 'Admin full name',
  })
  @IsString()
  name: string;
}

export class AdminDataDto {
  @ApiProperty({
    example: '696b5ed6a0af5a0ed21e0dbb',
  })
  id: string;

  @ApiProperty({
    example: 'admin@raha.com',
  })
  email: string;

  @ApiProperty({
    example: 'Super Admin',
  })
  name: string;

  @ApiProperty({
    example: 'admin',
  })
  role: string;

  @ApiProperty({
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5NmI1ZWQ2YTBhZjVhMGVkMjFlMGRiYiIsImVtYWlsIjoiYWRtaW5AcmFoYS5jb20iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3Njg2NDQzMTAsImV4cCI6MTc2ODczMDcxMH0.RVwjYKDuWB3eLayy_01TLWfcmLA4mNUBzudJV11wZrE',
    description: 'JWT access token',
  })
  accessToken: string;
}

export class AdminResponseDto {
  @ApiProperty({
    example: 'Admin registered successfully',
  })
  message: string;

  @ApiProperty({
    type: AdminDataDto,
  })
  data: AdminDataDto;
}
