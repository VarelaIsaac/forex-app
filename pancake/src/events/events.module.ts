import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { TwelveDataModule } from '../twelve-data/twelve-data.module';

@Module({
  imports: [TwelveDataModule],
  providers: [EventsGateway],
  exports: [EventsGateway],
})
export class EventsModule {}
