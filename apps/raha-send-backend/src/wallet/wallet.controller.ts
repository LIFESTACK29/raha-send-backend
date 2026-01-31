import {
    Body,
    Controller,
    Get,
    Post,
    Req,
} from '@nestjs/common';
import {
    ApiOperation,
    ApiResponse,
    ApiTags,
    ApiBearerAuth,
} from '@nestjs/swagger';
import { WalletService } from '@app/wallet';
import { CreateDedicatedAccountDto } from '@app/paystack/dto/create-dedicated-account.dto';
import { ResolveBankAccountDto } from '@app/paystack/dto/resolve-bank-account.dto';
import { CheckBalanceDto } from '@app/wallet/dto/check-balance.dto';
import {
    DedicatedAccountResponseDto,
    WalletBalanceResponseDto,
    BalanceCheckResponseDto,
    ResolvedAccountResponseDto,
} from '@app/wallet/dto/wallet-response.dto';

@ApiTags('Wallet')
@ApiBearerAuth()
@Controller('wallet')
export class WalletController {
    constructor(private readonly walletService: WalletService) { }

    @Post('dedicated-account')
    @ApiOperation({
        summary: 'Create Dedicated Virtual Account',
        description:
            'Creates a Paystack Dedicated Virtual Account (DVA) for the user. This account can be used to receive payments that will automatically credit the wallet.',
    })
    @ApiResponse({
        status: 201,
        description: 'Dedicated account created successfully.',
        type: DedicatedAccountResponseDto,
    })
    @ApiResponse({
        status: 400,
        description: 'Bad Request (e.g., user already has a dedicated account).',
    })
    async createDedicatedAccount(
        @Req() req,
        @Body() payload: CreateDedicatedAccountDto,
    ) {
        return this.walletService.createDedicatedAccount(req.user.sub, payload);
    }

    @Get('dedicated-account')
    @ApiOperation({
        summary: 'Get Dedicated Virtual Account',
        description: "Retrieves the user's dedicated virtual account details.",
    })
    @ApiResponse({
        status: 200,
        description: 'Dedicated account details retrieved successfully.',
        type: DedicatedAccountResponseDto,
    })
    @ApiResponse({
        status: 404,
        description: 'User does not have a dedicated account.',
    })
    async getDedicatedAccount(@Req() req) {
        return this.walletService.getDedicatedAccount(req.user.sub);
    }

    @Get('balance')
    @ApiOperation({
        summary: 'Get Wallet Balance',
        description: "Retrieves the user's current wallet balance in kobo.",
    })
    @ApiResponse({
        status: 200,
        description: 'Wallet balance retrieved successfully.',
        type: WalletBalanceResponseDto,
    })
    async getBalance(@Req() req) {
        return this.walletService.getBalance(req.user.sub);
    }

    @Post('resolve-bank')
    @ApiOperation({
        summary: 'Resolve Bank Account',
        description:
            "Verifies and retrieves details of a customer's bank account using their account number and bank code.",
    })
    @ApiResponse({
        status: 200,
        description: 'Bank account resolved successfully.',
        type: ResolvedAccountResponseDto,
    })
    @ApiResponse({
        status: 400,
        description: 'Bad Request (e.g., invalid account number or bank code).',
    })
    async resolveBankAccount(@Body() payload: ResolveBankAccountDto) {
        return this.walletService.resolveBankAccount(payload);
    }

    @Post('check-balance')
    @ApiOperation({
        summary: 'Check Wallet Balance for Ride Fee',
        description:
            'Checks if the wallet has sufficient balance for a ride fee. Returns whether the balance is sufficient and the balance after potential deduction.',
    })
    @ApiResponse({
        status: 200,
        description: 'Balance check completed.',
        type: BalanceCheckResponseDto,
    })
    async checkBalance(@Req() req, @Body() payload: CheckBalanceDto) {
        return this.walletService.checkBalance(req.user.sub, payload.amount);
    }

    @Post('deduct')
    @ApiOperation({
        summary: 'Deduct Ride Fee from Wallet',
        description:
            'Deducts the specified amount from the wallet for a ride fee. This should be called when a ride is confirmed and paired to a rider.',
    })
    @ApiResponse({
        status: 200,
        description: 'Balance deducted successfully.',
    })
    @ApiResponse({
        status: 400,
        description: 'Insufficient wallet balance.',
    })
    async deductBalance(@Req() req, @Body() payload: CheckBalanceDto) {
        return this.walletService.deductBalance(req.user.sub, payload.amount);
    }
}
