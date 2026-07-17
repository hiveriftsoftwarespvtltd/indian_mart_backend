import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Body, 
  Param, 
  UseGuards, 
  UseInterceptors, 
  UploadedFile, 
  Req 
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { Request } from 'express';

// Multer storage configuration for category image
const storageOptions = diskStorage({
  destination: join(__dirname, '..', '..', 'uploads'),
  filename: (req, file, callback) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    callback(null, `${uniqueSuffix}${extname(file.originalname)}`);
  },
});

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  async findAll() {
    return this.categoriesService.findAll();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image', { storage: storageOptions }))
  async create(
    @Body() body: any,
    @UploadedFile() file: any,
    @Req() req: Request,
  ) {
    let imageUrl = body.image || '';
    if (file) {
      const host = req.get('host');
      const protocol = req.protocol;
      imageUrl = `${protocol}://${host}/uploads/${file.filename}`;
    }
    return this.categoriesService.create({
      name: body.name,
      featured: body.featured === 'true' || body.featured === true,
      image: imageUrl,
    });
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image', { storage: storageOptions }))
  async update(
    @Param('id') id: string,
    @Body() body: any,
    @UploadedFile() file: any,
    @Req() req: Request,
  ) {
    const updateData: any = {};
    if (body.name !== undefined) updateData.name = body.name;
    if (body.featured !== undefined) {
      updateData.featured = body.featured === 'true' || body.featured === true;
    }
    if (file) {
      const host = req.get('host');
      const protocol = req.protocol;
      updateData.image = `${protocol}://${host}/uploads/${file.filename}`;
    } else if (body.image !== undefined) {
      updateData.image = body.image;
    }
    return this.categoriesService.update(id, updateData);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }
}
