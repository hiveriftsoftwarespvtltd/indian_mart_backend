import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): object {
    return {
      message: 'Indian Mart Backend API',
      version: '1.0.0',
      status: 'running',
      docs: '/api/docs',
    };
  }
}
