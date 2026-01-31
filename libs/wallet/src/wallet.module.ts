import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WalletService } from './wallet.service';
import { User, UserSchema, Wallet, WalletSchema } from '@app/common';
import { PaystackModule } from '@app/paystack';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: User.name, schema: UserSchema },
            { name: Wallet.name, schema: WalletSchema },
        ]),
        PaystackModule,
    ],
    providers: [WalletService],
    exports: [WalletService],
})
export class WalletModule { }
