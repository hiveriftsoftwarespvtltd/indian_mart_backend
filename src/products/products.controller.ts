import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  Req,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Request } from 'express';

// Multer storage configuration
const storageOptions = diskStorage({
  destination: './uploads',
  filename: (req, file, callback) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    callback(null, `${uniqueSuffix}${extname(file.originalname)}`);
  },
});

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async findAll(@Query('category') category?: string) {
    return this.productsService.findAll(category);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'image', maxCount: 1 },
    { name: 'images', maxCount: 8 }
  ], { storage: storageOptions }))
  async create(
    @Body() body: any,
    @UploadedFiles() files: { image?: any[], images?: any[] },
    @Req() req: Request,
  ) {
    const host = req.get('host');
    const protocol = req.protocol;

    let imageUrl = body.image || '';
    if (files?.image?.[0]) {
      imageUrl = `${protocol}://${host}/uploads/${files.image[0].filename}`;
    }

    let galleryUrls: string[] = [];
    if (files?.images) {
      galleryUrls = files.images.map(f => `${protocol}://${host}/uploads/${f.filename}`);
    } else if (body.images) {
      if (typeof body.images === 'string') {
        try {
          galleryUrls = JSON.parse(body.images);
        } catch (e) {
          galleryUrls = body.images.split(',').map((u) => u.trim()).filter(Boolean);
        }
      } else {
        galleryUrls = body.images;
      }
    }

    let tagsArray = body.tags || [];
    if (typeof tagsArray === 'string') {
      try {
        tagsArray = JSON.parse(tagsArray);
      } catch (e) {
        tagsArray = tagsArray.split(',').map((t) => t.trim()).filter(Boolean);
      }
    }

    return this.productsService.create({
      title: body.title,
      material: body.material,
      type: body.type,
      image: imageUrl,
      images: galleryUrls,
      tags: tagsArray,
      category: body.category || '',
    });
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'image', maxCount: 1 },
    { name: 'images', maxCount: 8 }
  ], { storage: storageOptions }))
  async update(
    @Param('id') id: string,
    @Body() body: any,
    @UploadedFiles() files: { image?: any[], images?: any[] },
    @Req() req: Request,
  ) {
    const host = req.get('host');
    const protocol = req.protocol;

    const updateData: any = {
      title: body.title,
      material: body.material,
      type: body.type,
      category: body.category,
    };

    if (files?.image?.[0]) {
      updateData.image = `${protocol}://${host}/uploads/${files.image[0].filename}`;
    } else if (body.image) {
      updateData.image = body.image;
    }

    let galleryUrls: string[] = [];
    if (files?.images) {
      galleryUrls = files.images.map(f => `${protocol}://${host}/uploads/${f.filename}`);
      updateData.images = galleryUrls;
    } else if (body.images) {
      if (typeof body.images === 'string') {
        try {
          galleryUrls = JSON.parse(body.images);
        } catch (e) {
          galleryUrls = body.images.split(',').map((u) => u.trim()).filter(Boolean);
        }
      } else {
        galleryUrls = body.images;
      }
      updateData.images = galleryUrls;
    }

    if (body.tags) {
      let tagsArray = body.tags;
      if (typeof tagsArray === 'string') {
        try {
          tagsArray = JSON.parse(tagsArray);
        } catch (e) {
          tagsArray = tagsArray.split(',').map((t) => t.trim()).filter(Boolean);
        }
      }
      updateData.tags = tagsArray;
    }

    return this.productsService.update(id, updateData);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
