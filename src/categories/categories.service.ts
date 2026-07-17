import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from './schemas/category.schema';

@Injectable()
export class CategoriesService {
  constructor(@InjectModel(Category.name) private categoryModel: Model<Category>) {}

  async findAll(): Promise<Category[]> {
    return this.categoryModel.find().exec();
  }

  async create(createDto: { name: string; featured?: boolean; image?: string }): Promise<Category> {
    const existing = await this.categoryModel.findOne({ name: createDto.name });
    if (existing) {
      throw new ConflictException('Category already exists');
    }
    const created = new this.categoryModel(createDto);
    return created.save();
  }

  async update(id: string, updateDto: { name?: string; featured?: boolean; image?: string }): Promise<Category> {
    const updated = await this.categoryModel.findByIdAndUpdate(id, updateDto, { new: true }).exec();
    if (!updated) {
      throw new NotFoundException('Category not found');
    }
    return updated;
  }

  async remove(id: string): Promise<any> {
    const result = await this.categoryModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Category not found');
    }
    return result;
  }
}
