import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';

export interface IRider extends Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  sex: string;
  dateOfBirth: Date;
  phone: string;
  profileImage: string;
  vehicle: Types.ObjectId;
  isActive: boolean;
  role: string;
  createdBy: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

@Schema({ timestamps: true })
export class Rider extends Document {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true })
  sex: string;

  @Prop({ required: true })
  dateOfBirth: Date;

  @Prop({ required: true, unique: true })
  phone: string;

  @Prop()
  profileImage: string;

  @Prop({ type: Types.ObjectId, ref: 'Vehicle' })
  vehicle: Types.ObjectId;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: 'rider' })
  role: string;

  @Prop({ default: 'IDLE', enum: ['IDLE', 'BUSY', 'OFFLINE'] })
  status: string;

  @Prop()
  createdBy: string;
}

export const RiderSchema = SchemaFactory.createForClass(Rider);

RiderSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error) {
    throw error;
  }
});

// Add method to compare passwords
RiderSchema.methods.comparePassword = async function (
  candidatePassword: string,
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};
