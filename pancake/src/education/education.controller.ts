/* eslint-disable prettier/prettier */
import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { EducationService } from './education.service';

@ApiTags('Education')
@Controller('education')
export class EducationController {
  constructor(private educationService: EducationService) {}

  /**
   * Get forex trading glossary
   */
  @Get('glossary')
  @ApiOperation({ 
    summary: 'Get forex glossary',
    description: 'Comprehensive glossary of forex trading terms with definitions and examples',
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Glossary retrieved successfully (15 terms)',
  })
  getGlossary() {
    return this.educationService.getGlossary();
  }

  /**
   * Get all tutorials
   */
  @Get('tutorials')
  @ApiOperation({ 
    summary: 'Get all tutorials',
    description: 'Step-by-step tutorials for beginner forex traders (4 comprehensive guides)',
  })
  @ApiResponse({ status: 200, description: 'Tutorials retrieved successfully' })
  getTutorials() {
    return this.educationService.getTutorials();
  }

  /**
   * Get a specific tutorial by ID
   */
  @Get('tutorials/:id')
  @ApiOperation({ 
    summary: 'Get tutorial by ID',
    description: 'Retrieve a specific tutorial with detailed step-by-step instructions',
  })
  @ApiParam({ 
    name: 'id', 
    description: 'Tutorial ID',
    enum: ['first-trade', 'understanding-pairs', 'risk-management', 'market-analysis'],
  })
  @ApiResponse({ status: 200, description: 'Tutorial found' })
  @ApiResponse({ status: 404, description: 'Tutorial not found' })
  getTutorialById(@Param('id') id: string) {
    return this.educationService.getTutorialById(id);
  }

  /**
   * Get trading tips
   */
  @Get('tips')
  @ApiOperation({ 
    summary: 'Get trading tips',
    description: 'Practical trading tips and best practices for beginners (15 tips)',
  })
  @ApiResponse({ status: 200, description: 'Tips retrieved successfully' })
  getTradingTips() {
    return this.educationService.getTradingTips();
  }
}
