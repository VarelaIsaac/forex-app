import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min } from 'class-validator';

export class CloseTradeDto {
  @ApiProperty({
    description: 'ID of the trade to close',
    example: 1,
    minimum: 1,
  })
  @IsNumber()
  @Min(1, { message: 'Trade ID must be a positive number' })
  tradeId: number;
}
