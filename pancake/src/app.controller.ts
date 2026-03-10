import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('Health')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ 
    summary: 'Health check endpoint',
    description: 'Check if the API is running and responsive',
  })
  @ApiResponse({ 
    status: 200, 
    description: 'API is healthy',
    schema: {
      example: {
        status: 'ok',
        message: 'Pancake Forex Trading API is running',
        version: '1.0.0',
        timestamp: '2026-02-17T12:00:00.000Z',
      },
    },
  })
  getHealth() {
    return {
      status: 'ok',
      message: 'Pancake Forex Trading API is running',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
    };
  }
}
