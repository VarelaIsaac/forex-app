import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, Min, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateSessionDto {
  @ApiProperty({
    description: 'Initial cash allocation pulled from the main portfolio',
    example: 2500,
    minimum: 1,
  })
  @IsNumber()
  @Min(1, { message: 'Allocation must be at least $1' })
  allocation: number;

  @ApiPropertyOptional({
    description: 'Friendly label to help the trader identify the session',
    example: 'London overlap scalp',
  })
  @IsOptional()
  @IsString()
  @MaxLength(120, { message: 'Session name must be 120 characters or less' })
  name?: string;
}
