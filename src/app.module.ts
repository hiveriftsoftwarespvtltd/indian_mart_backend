import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { EnquiriesModule } from './enquiries/enquiries.module';
import { BannersModule } from './banners/banners.module';
import { ContentModule } from './content/content.module';
import { GalleryModule } from './gallery/gallery.module';
import { ClientsModule } from './clients/clients.module';
import { ProjectsModule } from './projects/projects.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    AuthModule,
    CategoriesModule,
    ProductsModule,
    EnquiriesModule,
    BannersModule,
    ContentModule,
    GalleryModule,
    ClientsModule,
    ProjectsModule,

    
    
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        uri: config.get<string>('MONGO_URI'),
        dbName: 'indian_mart_backend',
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

