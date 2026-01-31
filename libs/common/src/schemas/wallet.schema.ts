import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export class DedicatedAccount {
    @Prop({ required: true })
    accountNumber: string;

    @Prop({ required: true })
    accountName: string;

    @Prop({ required: true })
    bankName: string;

    @Prop({ required: true })
    bankCode: string;

    @Prop({ required: true })
    customerId: string;
}

export interface IWallet extends Document {
    userId: Types.ObjectId;
    balance: number;
    dedicatedAccount?: DedicatedAccount;
}

@Schema({ timestamps: true })
export class Wallet extends Document {
    @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true })
    userId: Types.ObjectId;

    @Prop({ default: 0 })
    balance: number;

    @Prop({ type: Object })
    dedicatedAccount: DedicatedAccount;
}

export const WalletSchema = SchemaFactory.createForClass(Wallet);
