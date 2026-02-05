import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export interface IAddress extends Document {
    addressId: string;
    city: string;
    state: string;
    country: string;
    line1: string;
    line2?: string;
    zip: string;
    phone: string;
    email?: string;
    name: string;
    firstName?: string;
    lastName?: string;
    is_residential?: boolean;
    latitude?: number;
    longitude?: number;
    metadata?: any;
}

@Schema({ timestamps: true })
export class Address extends Document {
    @Prop({ required: true, unique: true })
    addressId: string;

    @Prop({ required: true })
    city: string;

    @Prop({ required: true })
    state: string;

    @Prop({ required: true })
    country: string;

    @Prop({ required: true })
    line1: string;

    @Prop()
    line2: string;

    @Prop({ required: true })
    zip: string;

    @Prop({ required: true })
    phone: string;

    @Prop()
    email: string;

    @Prop({ required: true })
    name: string;

    @Prop()
    firstName: string;

    @Prop()
    lastName: string;

    @Prop({ default: true })
    is_residential: boolean;

    @Prop({ type: Number, required: true })
    latitude: number;

    @Prop({ type: Number, required: true })
    longitude: number;

    @Prop({ type: Object })
    metadata: any;

}

export const AddressSchema = SchemaFactory.createForClass(Address);
