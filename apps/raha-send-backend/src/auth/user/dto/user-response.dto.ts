import { ApiProperty } from '@nestjs/swagger';

export class DedicatedAccountDto {
  @ApiProperty({ example: '0123456789' })
  accountNumber: string;

  @ApiProperty({ example: 'RAHA-JANE DOE' })
  accountName: string;

  @ApiProperty({ example: 'Wema Bank' })
  bankName: string;

  @ApiProperty({ example: '035' })
  bankCode: string;

  @ApiProperty({ example: 'CUS_abc123xyz' })
  customerId: string;
}

export class UserProfileDto {
  @ApiProperty({ example: '65a123bcde456...' })
  _id: string;

  @ApiProperty({ example: 'John' })
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  lastName: string;

  @ApiProperty({ example: 'john.doe@techcorp.com' })
  email: string;

  @ApiProperty({ example: '+2348012345678' })
  phone: string;

  @ApiProperty({ example: false })
  isLiveMode: boolean;

  @ApiProperty({ example: 'pk_test_a1b2c3d4e5...' })
  testPublicKey: string;

  @ApiProperty({ example: 'sk_test_f6g7h8i9j0...' })
  testSecretKey: string;

  @ApiProperty({ example: 'pk_live_k1l2m3n4o5...' })
  livePublicKey: string;

  @ApiProperty({ example: 'sk_live_p6q7r8s9t0...' })
  liveSecretKey: string;

  @ApiProperty({ example: 50000, description: 'Wallet balance in kobo' })
  walletBalance: number;

  @ApiProperty({ type: DedicatedAccountDto, required: false })
  dedicatedAccount?: DedicatedAccountDto;

  @ApiProperty({ example: '2024-01-20T10:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-20T10:00:00.000Z' })
  updatedAt: Date;
}

export class AuthResponseDto {
  @ApiProperty({ type: UserProfileDto })
  user: UserProfileDto;

  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR...' })
  accessToken: string;
}

export class ModeResponseDto {
  @ApiProperty({ example: true, description: 'Current live mode status' })
  isLiveMode: boolean;
}

