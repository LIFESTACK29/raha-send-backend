import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export interface IVehicle extends Document {
  make: string;
  vehicleModel: string;
  plateNumber: string;
  vin: string;
  color: string;
  driversLicenseImage: string;
  carImages: string[];
  rider: Types.ObjectId;
}

@Schema({ timestamps: true })
export class Vehicle extends Document {
  @Prop({ required: true })
  make: string;

  @Prop({ required: true })
  vehicleModel: string;

  @Prop({ required: true })
  plateNumber: string;

  @Prop({ required: true })
  vin: string;

  @Prop({ required: true })
  color: string;

  @Prop({ required: true })
  driversLicenseImage: string;

  @Prop({ type: [String], required: true })
  carImages: string[];

  @Prop({ type: Types.ObjectId, ref: 'Rider', required: true })
  rider: Types.ObjectId;
}

export const VehicleSchema = SchemaFactory.createForClass(Vehicle);
