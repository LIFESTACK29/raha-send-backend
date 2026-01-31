import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum ShipmentStatus {
    DRAFT = 'draft',
    CREATED = 'created',
    PICKUP_SCHEDULED = 'pickup_scheduled',
    IN_TRANSIT = 'in_transit',
    DELIVERED = 'delivered',
    CANCELLED = 'cancelled',
}

export enum PaymentStatus {
    PENDING = 'pending',
    PAID = 'paid',
    FAILED = 'failed',
}

@Schema({ timestamps: true })
export class Shipment extends Document {
    @Prop({ required: true, unique: true })
    shipmentId: string;

    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    userId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'Parcel', required: true })
    parcelId: Types.ObjectId;

    // We store addressId (string) or ObjectId? 
    // User decoupled logic suggests string addressId or linking to the actual Address doc
    // Let's link to the Address Document for easier population if we need it, 
    // OR just store the address snapshot.
    // Given the decoupled nature, we might want to store the Address Object ID reference.

    @Prop({ type: Types.ObjectId, ref: 'Address', required: true })
    pickupAddressId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'Address', required: true })
    deliveryAddressId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'Rider', required: false })
    riderId?: Types.ObjectId;

    @Prop()
    pickupTime?: Date;

    @Prop()
    deliveryTime?: Date;

    @Prop({ required: true, enum: ShipmentStatus, default: ShipmentStatus.DRAFT })
    status: ShipmentStatus;

    @Prop({ required: true })
    price: number; // in kobo

    @Prop({ required: true })
    distance: number; // in km

    @Prop({ required: true, enum: PaymentStatus, default: PaymentStatus.PENDING })
    paymentStatus: PaymentStatus;

    @Prop({ type: Object })
    metadata: any;
}

export const ShipmentSchema = SchemaFactory.createForClass(Shipment);
