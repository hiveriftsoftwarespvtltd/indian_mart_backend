import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class GalleryItem extends Document {
  @Prop({ required: true })
  image: string;

  @Prop({ required: true })
  category: string; // Buddha Statues, Animal Statues, Artificial Trees, God Statues, Sculpture Art, Glowing Statues, Ashoka Pillar, Others
}

export const GalleryItemSchema = SchemaFactory.createForClass(GalleryItem);
