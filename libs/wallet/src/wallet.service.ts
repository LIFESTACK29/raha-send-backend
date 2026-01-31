import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, Wallet, DedicatedAccount } from '@app/common';
import { PaystackService } from '@app/paystack';
import { AssignAccountDto } from '@app/paystack/dto/assign-account.dto';
import { ResolveBankAccountDto } from '@app/paystack/dto/resolve-bank-account.dto';

@Injectable()
export class WalletService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        @InjectModel(Wallet.name) private walletModel: Model<Wallet>,
        private readonly paystackService: PaystackService,
    ) { }

    async createDedicatedAccount(userId: string, payload: AssignAccountDto) {
        const user = await this.userModel.findById(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        // Find or create wallet for user
        let wallet = await this.walletModel.findOne({ userId: user._id });
        if (!wallet) {
            wallet = new this.walletModel({ userId: user._id, balance: 0 });
            await wallet.save();
        }

        if (wallet.dedicatedAccount?.accountNumber) {
            throw new BadRequestException(
                'User already has a dedicated account. Account number: ' +
                wallet.dedicatedAccount.accountNumber,
            );
        }

        const response = await this.paystackService.assignAccount(payload);

        if (!response.status) {
            throw new BadRequestException(
                response.message || 'Failed to create dedicated account',
            );
        }

        const accountData = response.data;
        const dedicatedAccount: DedicatedAccount = {
            accountNumber: accountData.account_number,
            accountName: accountData.account_name,
            bankName: accountData.bank?.name || accountData.bank_name,
            bankCode: accountData.bank?.slug || payload.preferred_bank,
            customerId:
                accountData.customer?.customer_code || accountData.customer_id,
        };

        wallet.dedicatedAccount = dedicatedAccount;
        await wallet.save();

        return {
            message: 'Dedicated account created successfully',
            dedicatedAccount,
        };
    }

    async getOrCreateWallet(userId: string) {
        const user = await this.userModel.findById(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        let wallet = await this.walletModel.findOne({ userId: user._id });
        if (!wallet) {
            wallet = new this.walletModel({ userId: user._id, balance: 0 });
            await wallet.save();
        }

        return wallet;
    }

    async getBalance(userId: string) {
        const wallet = await this.getOrCreateWallet(userId);

        return {
            balance: wallet.balance || 0,
            currency: 'NGN',
        };
    }

    async resolveBankAccount(payload: ResolveBankAccountDto) {
        const result = await this.paystackService.verifyAccountNumber({
            accountNumber: payload.account_number,
            bankCode: payload.bank_code,
        });

        return result;
    }

    async checkBalance(userId: string, amount: number) {
        const wallet = await this.getOrCreateWallet(userId);

        const currentBalance = wallet.balance || 0;
        const hasSufficientBalance = currentBalance >= amount;

        return {
            hasSufficientBalance,
            currentBalance,
            requiredAmount: amount,
            balanceAfterDeduction: hasSufficientBalance
                ? currentBalance - amount
                : currentBalance,
        };
    }

    async deductBalance(userId: string, amount: number) {
        const wallet = await this.getOrCreateWallet(userId);

        const currentBalance = wallet.balance || 0;
        if (currentBalance < amount) {
            throw new BadRequestException(
                `Insufficient wallet balance. Current balance: ${currentBalance} kobo, Required: ${amount} kobo`,
            );
        }

        wallet.balance = currentBalance - amount;
        await wallet.save();

        return {
            message: 'Balance deducted successfully',
            previousBalance: currentBalance,
            amountDeducted: amount,
            newBalance: wallet.balance,
        };
    }

    async creditWallet(userId: string, amount: number) {
        const wallet = await this.getOrCreateWallet(userId);

        const currentBalance = wallet.balance || 0;
        wallet.balance = currentBalance + amount;
        await wallet.save();

        return {
            message: 'Wallet credited successfully',
            previousBalance: currentBalance,
            amountCredited: amount,
            newBalance: wallet.balance,
        };
    }

    async creditWalletByEmail(email: string, amount: number) {
        const user = await this.userModel.findOne({ email });
        if (!user) {
            // In production, might want to log this failure
            throw new NotFoundException(`User with email ${email} not found`);
        }

        return this.creditWallet(user._id.toString(), amount);
    }

    async getDedicatedAccount(userId: string) {
        const wallet = await this.getOrCreateWallet(userId);

        if (!wallet.dedicatedAccount?.accountNumber) {
            throw new NotFoundException(
                'User does not have a dedicated account. Please create one first.',
            );
        }

        return wallet.dedicatedAccount;
    }

    async getWallet(userId: string) {
        const wallet = await this.getOrCreateWallet(userId);

        return {
            balance: wallet.balance || 0,
            currency: 'NGN',
            dedicatedAccount: wallet.dedicatedAccount || null,
        };
    }
}
