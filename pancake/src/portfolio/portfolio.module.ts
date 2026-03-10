import { Module } from '@nestjs/common';
import { PortfolioController } from './portfolio.controller';
import { PortfolioService } from './portfolio.service';
import { PayPalService } from './paypal.service';
import { EventsModule } from '../events/events.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    EventsModule,
    UsersModule,
  ],
  controllers: [PortfolioController],
  providers: [PortfolioService, PayPalService],
  exports: [PortfolioService],
})
export class PortfolioModule {}
