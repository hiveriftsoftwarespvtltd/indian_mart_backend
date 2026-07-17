import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Enquiry extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ default: '' })
  email: string;

  @Prop({ required: true })
  subject: string;

  @Prop({ default: '' })
  message: string;

  @Prop({ default: () => new Date().toISOString().slice(0, 10) })
  date: string;

  @Prop({ default: '' })
  image: string;

  @Prop({ default: 'Pending' })
  status: string; // Pending, Hold, Converted, Lost
}

export const EnquirySchema = SchemaFactory.createForClass(Enquiry);
