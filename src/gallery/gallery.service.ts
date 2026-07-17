import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GalleryItem } from './schemas/gallery-item.schema';

@Injectable()
export class GalleryService {
  constructor(@InjectModel(GalleryItem.name) private galleryModel: Model<GalleryItem>) {}

  async findAll(): Promise<GalleryItem[]> {
    return this.galleryModel.find().sort({ createdAt: -1 }).exec();
  }

  async create(createDto: { image: string; category: string }): Promise<GalleryItem> {
    const created = new this.galleryModel(createDto);
    return created.save();
  }

  async remove(id: string): Promise<any> {
    const result = await this.galleryModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Gallery item not found');
    }
    return result;
  }
}
