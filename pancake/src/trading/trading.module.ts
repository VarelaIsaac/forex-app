/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TradingController } from './trading.controller';
import { TradingService } from './trading.service';
import { TwelveDataModule } from '../twelve-data/twelve-data.module';
import { PortfolioModule } from '../portfolio/portfolio.module';
import { EventsModule } from '../events/events.module';

@Module({
  imports: [
    TwelveDataModule,
    PortfolioModule,
    EventsModule,
  ],
  controllers: [TradingController],
  providers: [TradingService],
  exports: [TradingService],
})
export class TradingModule {}
