import { Module } from '@nestjs/common';
import { PortfolioController } from './portfolio.controller';
import { PortfolioService } from './portfolio.service';
import { PayPalService } from './paypal.service';
import { EventsModule } from '../events/events.module';
import { UsersModule } from '../users/users.module';
import { SessionsModule } from '../sessions/sessions.module';

@Module({
  imports: [
    EventsModule,
    UsersModule,
    SessionsModule,
  ],
  controllers: [PortfolioController],
  providers: [PortfolioService, PayPalService],
  exports: [PortfolioService],
})
export class PortfolioModule {}
