import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Banner } from './schemas/banner.schema';

@Injectable()
export class BannersService {
  constructor(@InjectModel(Banner.name) private bannerModel: Model<Banner>) {}

  async findActive(): Promise<Banner[]> {
    return this.bannerModel.find({ active: true }).exec();
  }

  async findAll(): Promise<Banner[]> {
    return this.bannerModel.find().exec();
  }

  async create(createDto: any): Promise<Banner> {
    const created = new this.bannerModel(createDto);
    return created.save();
  }

  async toggleStatus(id: string): Promise<Banner> {
    const banner = await this.bannerModel.findById(id).exec();
    if (!banner) {
      throw new NotFoundException('Banner not found');
    }
    banner.active = !banner.active;
    return banner.save();
  }

  async update(id: string, updateDto: any): Promise<Banner> {
    const updated = await this.bannerModel.findByIdAndUpdate(id, updateDto, { new: true }).exec();
    if (!updated) {
      throw new NotFoundException('Banner not found');
    }
    return updated;
  }

  async remove(id: string): Promise<any> {
    const result = await this.bannerModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Banner not found');
    }
    return result;
  }
}
