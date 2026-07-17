import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Req,
} from '@nestjs/common';
import { BannersService } from './banners.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { Request } from 'express';

const storageOptions = diskStorage({
  destination: join(__dirname, '..', '..', 'uploads'),
  filename: (req, file, callback) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    callback(null, `banner-${uniqueSuffix}${extname(file.originalname)}`);
  },
});

@Controller('banners')
export class BannersController {
  constructor(private readonly bannersService: BannersService) {}

  @Get()
  async findActive() {
    return this.bannersService.findActive();
  }

  @Get('admin')
  @UseGuards(JwtAuthGuard)
  async findAll() {
    return this.bannersService.findAll();
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
    return this.bannersService.create({
      title: body.title,
      image: imageUrl,
      link: body.link || '#',
      active: body.active !== 'false',
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
    if (body.title !== undefined) updateData.title = body.title;
    if (body.link !== undefined) updateData.link = body.link;
    if (body.active !== undefined) updateData.active = body.active !== 'false';

    if (file) {
      const host = req.get('host');
      const protocol = req.protocol;
      updateData.image = `${protocol}://${host}/uploads/${file.filename}`;
    } else if (body.image) {
      updateData.image = body.image;
    }

    return this.bannersService.update(id, updateData);
  }

  @Patch(':id/toggle')
  @UseGuards(JwtAuthGuard)
  async toggleStatus(@Param('id') id: string) {
    return this.bannersService.toggleStatus(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string) {
    return this.bannersService.remove(id);
  }
}
