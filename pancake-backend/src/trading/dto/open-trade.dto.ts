import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsNumber, Min } from 'class-validator';
import { TradeType } from '@prisma/client';

export class OpenTradeDto {
  @ApiProperty({
    description: 'Currency pair to trade',
    example: 'EUR/USD',
    enum: ['EUR/USD', 'GBP/USD', 'USD/JPY', 'USD/CHF', 'AUD/USD', 'USD/CAD', 'NZD/USD'],
  })
  @IsString()
  currencyPair: string;

  @ApiProperty({
    description: 'Type of trade - BUY (long) or SELL (short)',
    enum: TradeType,
    example: TradeType.BUY,
  })
  @IsEnum(TradeType, { message: 'Trade type must be either BUY or SELL' })
  tradeType: TradeType;

  @ApiProperty({
    description: 'Amount to invest in USD',
    example: 1000,
    minimum: 1,
  })
  @IsNumber()
  @Min(1, { message: 'Trade amount must be at least $1' })
  amount: number;
}
