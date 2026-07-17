import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Category extends Document {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ type: Boolean, default: false })
  featured: boolean;

  @Prop({ type: String, default: '' })
  image: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
