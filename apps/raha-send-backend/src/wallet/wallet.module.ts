import { Module } from '@nestjs/common';
import { WalletModule as LibWalletModule } from '@app/wallet';
import { WebhookController } from '../paystack/webhook.controller';
import { WalletController } from './wallet.controller';

@Module({
    imports: [LibWalletModule],
    controllers: [WalletController, WebhookController],
})
export class WalletModule { }
