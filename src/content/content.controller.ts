import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { ContentService } from './content.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Get()
  async find() {
    return this.contentService.findOrCreate();
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  async update(@Body() updateDto: any) {
    return this.contentService.update(updateDto);
  }
}
