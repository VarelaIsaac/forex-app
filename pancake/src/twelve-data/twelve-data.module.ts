/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TwelveDataService } from './twelve-data.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [TwelveDataService],
  exports: [TwelveDataService],
})
export class TwelveDataModule {}
