import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Content } from '../content/schemas/content.schema';

@Injectable()
export class ProjectsService {
  constructor(@InjectModel(Content.name) private contentModel: Model<Content>) {}

  private async getContent(): Promise<Content> {
    let content = await this.contentModel.findOne().exec();
    if (!content) {
      content = new this.contentModel({});
      await content.save();
    }
    return content;
  }

  async findAll(): Promise<any[]> {
    const content = await this.getContent();
    return (content.projects || []).map((p: any) => ({
      _id: p._id || p.id,
      id: p.id || p._id,
      title: p.title,
      subtitle: p.subtitle,
      image: p.image,
    }));
  }

  async findOne(id: string): Promise<any> {
    const projects = await this.findAll();
    const found = projects.find((p) => String(p._id) === String(id) || String(p.id) === String(id));
    if (!found) {
      throw new NotFoundException('Project not found');
    }
    return found;
  }

  async create(createDto: any): Promise<any> {
    const content = await this.getContent();
    if (!content.projects) {
      content.projects = [];
    }
    const newProject = {
      _id: new Types.ObjectId().toString(),
      title: createDto.title,
      subtitle: createDto.subtitle || '',
      image: createDto.image || '',
    };
    content.projects.push(newProject);
    content.markModified('projects');
    await content.save();
    return newProject;
  }

  async update(id: string, updateDto: any): Promise<any> {
    const content = await this.getContent();
    if (!content.projects) {
      content.projects = [];
    }
    const index = content.projects.findIndex(
      (p: any) => String(p._id) === String(id) || String(p.id) === String(id),
    );
    if (index === -1) {
      throw new NotFoundException('Project not found');
    }

    const existing = content.projects[index];
    content.projects[index] = {
      ...existing,
      title: updateDto.title !== undefined ? updateDto.title : existing.title,
      subtitle: updateDto.subtitle !== undefined ? updateDto.subtitle : existing.subtitle,
      image: updateDto.image !== undefined ? updateDto.image : existing.image,
    };
    content.markModified('projects');
    await content.save();
    return content.projects[index];
  }

  async remove(id: string): Promise<any> {
    const content = await this.getContent();
    if (!content.projects) {
      content.projects = [];
    }
    content.projects = content.projects.filter(
      (p: any) => String(p._id) !== String(id) && String(p.id) !== String(id),
    );
    content.markModified('projects');
    await content.save();
    return { success: true };
  }
}
