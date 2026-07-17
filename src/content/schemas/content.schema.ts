import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Content extends Document {
  @Prop({ default: 'Nangloi, Safipur, Ranhola, New Delhi, 110041' })
  address: string;

  @Prop({ default: 'info@indiandhammaart.com' })
  email: string;

  @Prop({ default: '+91 85068 65563' })
  phone: string;

  @Prop({ default: 'Where Tradition Inspires Every Creation' })
  storyTitle: string;

  @Prop({
    default:
      'Indian Dhamma Art was born from a deep passion for Indian art, culture and spirituality. What started as a small studio has grown into a trusted name in custom handcrafted Buddha statues and premium decor for homes, businesses, temples, hotels and spiritual spaces.',
  })
  storyText1: string;

  @Prop({
    default:
      'Every piece we create is the result of devotion, patience and perfection. Our skilled artisans combine age-old techniques with modern design, ensuring every sculpture we deliver is a masterpiece.',
  })
  storyText2: string;
}

export const ContentSchema = SchemaFactory.createForClass(Content);
