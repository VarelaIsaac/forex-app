/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TradingController } from './trading.controller';
import { TradingService } from './trading.service';
import { IndicatorsService } from './indicators.service';
import { TwelveDataModule } from '../twelve-data/twelve-data.module';
import { PortfolioModule } from '../portfolio/portfolio.module';
import { EventsModule } from '../events/events.module';

@Module({
  imports: [
    HttpModule,
    TwelveDataModule,
    PortfolioModule,
    EventsModule,
  ],
  controllers: [TradingController],
  providers: [TradingService, IndicatorsService],
  exports: [TradingService, IndicatorsService],
})
export class TradingModule {}
