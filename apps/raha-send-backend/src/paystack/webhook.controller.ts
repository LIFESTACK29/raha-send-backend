import {
    Controller,
    Post,
    Body,
    Headers,
    BadRequestException,
    HttpCode,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WalletService } from '@app/wallet';
import * as crypto from 'crypto';

@Controller('paystack')
export class WebhookController {
    constructor(
        private readonly configService: ConfigService,
        private readonly walletService: WalletService,
    ) { }

    @Post('webhook')
    @HttpCode(200)
    async handleWebhook(
        @Body() body: any,
        @Headers('x-paystack-signature') signature: string,
    ) {
        if (!signature) {
            throw new BadRequestException('Missing signature');
        }

        const secret = this.configService.get<string>('PAYSTACK_SECRET');
        if (!secret) {
            throw new BadRequestException('Paystack secret not configured');
        }
        const hash = crypto
            .createHmac('sha512', secret)
            .update(JSON.stringify(body))
            .digest('hex');

        if (hash !== signature) {
            throw new BadRequestException('Invalid signature');
        }

        const event = body.event;
        const data = body.data;

        // Handle "charge.success" or "transfer.success" depending on how funding works.
        // For Dedicated Virtual Accounts, the event is usually "charge.success"
        // with channel "dedicated_nuban".

        if (event === 'charge.success') {
            // Amount is in kobo
            const amount = data.amount;
            const email = data.customer?.email;

            // We need to find the user by email or by customer code.
            // Ideally Paystack service/Wallet Service should handle finding user.
            // But WalletService.creditWallet needs userId.

            // We need a method in WalletService: creditWalletByEmail
            await this.walletService.creditWalletByEmail(email, amount);
        }

        return { status: 'success' };
    }
}
