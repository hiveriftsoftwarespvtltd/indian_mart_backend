import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Req,
  InternalServerErrorException,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { Request } from 'express';

const storageOptions = diskStorage({
  destination: join(__dirname, '..', '..', 'uploads'),
  filename: (req, file, callback) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    callback(null, `${uniqueSuffix}${extname(file.originalname)}`);
  },
});

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  async findAll() {
    return this.projectsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.projectsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image', { storage: storageOptions }))
  async create(
    @Body() body: any,
    @UploadedFile() file: any,
    @Req() req: Request,
  ) {
    try {
      const host = req.get('host');
      const protocol = req.protocol;

      let imageUrl = body.image || '';
      if (file) {
        imageUrl = `${protocol}://${host}/uploads/${file.filename}`;
      }

      return await this.projectsService.create({
        title: body.title,
        subtitle: body.subtitle || '',
        image: imageUrl,
      });
    } catch (error) {
      console.error('[ProjectsController] Error creating project:', error);
      throw new InternalServerErrorException({
        message: error.message,
        stack: error.stack,
        details: error,
      });
    }
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
    try {
      const host = req.get('host');
      const protocol = req.protocol;

      const updateData: any = {};
      if (body.title !== undefined) updateData.title = body.title;
      if (body.subtitle !== undefined) updateData.subtitle = body.subtitle;

      if (file) {
        updateData.image = `${protocol}://${host}/uploads/${file.filename}`;
      } else if (body.image) {
        updateData.image = body.image;
      }

      return await this.projectsService.update(id, updateData);
    } catch (error) {
      console.error('[ProjectsController] Error updating project:', error);
      throw new InternalServerErrorException({
        message: error.message,
        stack: error.stack,
        details: error,
      });
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string) {
    return this.projectsService.remove(id);
  }
}
