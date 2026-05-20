/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { TwelveDataModule } from './twelve-data/twelve-data.module';
import { TradingModule } from './trading/trading.module';
import { PortfolioModule } from './portfolio/portfolio.module';
import { EventsModule } from './events/events.module';
import { EducationModule } from './education/education.module';
import { LearningModule } from './learning/learning.module';
import { PrismaModule } from './prisma/prisma.module';
import { SessionsModule } from './sessions/sessions.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    // Rate limiting - 10 requests per 10 seconds per IP
    ThrottlerModule.forRoot([{
      ttl: 10000, // 10 seconds
      limit: 100, // 100 requests
    }]),
    UsersModule, 
    AuthModule, 
    TwelveDataModule, 
    TradingModule, 
    PortfolioModule, 
    EventsModule,
    EducationModule,
    LearningModule,
    SessionsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
