import { ApiProperty } from '@nestjs/swagger';

export class DedicatedAccountResponseDto {
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

export class WalletBalanceResponseDto {
    @ApiProperty({ example: 50000 })
    balance: number;

    @ApiProperty({ example: 'NGN' })
    currency: string;
}

export class BalanceCheckResponseDto {
    @ApiProperty({ example: true })
    hasSufficientBalance: boolean;

    @ApiProperty({ example: 50000 })
    currentBalance: number;

    @ApiProperty({ example: 5000 })
    requiredAmount: number;

    @ApiProperty({ example: 45000 })
    balanceAfterDeduction: number;
}

export class ResolvedAccountResponseDto {
    @ApiProperty({ example: '0022728151' })
    account_number: string;

    @ApiProperty({ example: 'JOHN DOE' })
    account_name: string;

    @ApiProperty({ example: 123456789 })
    bank_id: number;
}
