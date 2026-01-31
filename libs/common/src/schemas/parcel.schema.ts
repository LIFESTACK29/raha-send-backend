import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export class ParcelItem {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    quantity: number;

    @Prop({ required: true })
    value: number;

    @Prop()
    category: string;
}

@Schema({ timestamps: true })
export class Parcel extends Document {
    @Prop({ required: true, unique: true })
    parcelId: string;

    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    userId: Types.ObjectId;

    @Prop({ required: true })
    weight: number; // in kg

    @Prop()
    height: number; // in cm

    @Prop()
    width: number; // in cm

    @Prop()
    length: number; // in cm

    @Prop()
    description: string;

    @Prop({ type: [ParcelItem] })
    items: ParcelItem[];

    @Prop({ type: Object })
    metadata: any;
}

export const ParcelSchema = SchemaFactory.createForClass(Parcel);
