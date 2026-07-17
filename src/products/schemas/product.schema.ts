import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Product extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ default: 'FRP' })
  material: string;

  @Prop({ default: 'Indoor/Outdoor' })
  type: string;

  @Prop({ default: '' })
  image: string;

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ default: '' })
  category: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
