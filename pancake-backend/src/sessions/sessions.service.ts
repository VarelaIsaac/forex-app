/* eslint-disable prettier/prettier */
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { Prisma, Session, SessionStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { EventsGateway } from '../events/events.gateway';
import { CreateSessionDto } from './dto';

@Injectable()
export class SessionsService {
  constructor(
    private prisma: PrismaService,
    private eventsGateway: EventsGateway,
  ) {}

  /**
   * Create a new trading session funded from the main portfolio
   */
  async createSession(userId: string, dto: CreateSessionDto): Promise<Session> {
    const allocation = dto.allocation;

    if (allocation <= 0) {
      throw new BadRequestException('Allocation must be greater than zero');
    }

    const session = await this.prisma.$transaction(async tx => {
      const portfolio = await tx.portfolio.findFirst({ where: { userId } });

      if (!portfolio) {
        throw new NotFoundException('Portfolio not found');
      }

      if (Number(portfolio.balance) < allocation) {
        throw new BadRequestException('Insufficient portfolio balance to fund session');
      }

      const createdSession = await tx.session.create({
        data: {
          userId,
          portfolioId: portfolio.id,
          name: dto.name ?? `Session ${new Date().toISOString()}`,
          startingBalance: allocation,
          currentBalance: allocation,
        },
      });

      await tx.portfolio.update({
        where: { id: portfolio.id },
        data: { balance: { decrement: allocation } },
      });

      return createdSession;
    });

    this.eventsGateway.emitSessionNotification(userId, {
      type: 'SESSION_CREATED',
      sessionId: session.id,
      balance: session.currentBalance,
    });

    return session;
  }

  async getSessions(userId: string): Promise<Session[]> {
    return await this.prisma.session.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        trades: true,
      },
    });
  }

  async getActiveSessions(userId: string): Promise<Session[]> {
    return await this.prisma.session.findMany({
      where: { userId, status: SessionStatus.ACTIVE },
      orderBy: { createdAt: 'desc' },
      include: {
        trades: true,
      },
    });
  }

  async getSessionById(userId: string, sessionId: number): Promise<Session & { trades: any[] }> {
    const session = await this.prisma.session.findFirst({
      where: { id: sessionId, userId },
      include: {
        trades: true,
      },
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    return session;
  }

  async getSessionSummary(userId: string, sessionId: number): Promise<Session> {
    const session = await this.prisma.session.findFirst({ where: { id: sessionId, userId } });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    return session;
  }

  async endSession(userId: string, sessionId: number): Promise<Session> {
    const session = await this.getSessionById(userId, sessionId);

    if (session.status === SessionStatus.CLOSED) {
      throw new BadRequestException('Session is already closed');
    }

    const updatedSession = await this.prisma.$transaction(async tx => {
      await tx.portfolio.update({
        where: { id: session.portfolioId },
        data: { balance: { increment: session.currentBalance } },
      });

      return await tx.session.update({
        where: { id: sessionId },
        data: {
          status: SessionStatus.CLOSED,
          endedAt: new Date(),
        },
        include: { trades: true },
      });
    });

    this.eventsGateway.emitSessionNotification(userId, {
      type: 'SESSION_CLOSED',
      sessionId,
      returned: updatedSession.currentBalance,
    });

    this.eventsGateway.emitPortfolioUpdate(userId, {
      type: 'PORTFOLIO_BALANCE_UPDATED',
    });

    return updatedSession;
  }

  async debitSession(sessionId: number, amount: number): Promise<Session> {
    if (amount <= 0) {
      throw new BadRequestException('Amount must be positive');
    }

    return await this.adjustSessionBalance(sessionId, -amount);
  }

  async creditSession(sessionId: number, amount: number): Promise<Session> {
    if (amount <= 0) {
      throw new BadRequestException('Amount must be positive');
    }

    return await this.adjustSessionBalance(sessionId, amount, { enforceBalance: false });
  }

  private async adjustSessionBalance(
    sessionId: number,
    delta: number,
    options: { enforceBalance?: boolean } = { enforceBalance: true },
  ): Promise<Session> {
    const updatedSession = await this.prisma.$transaction(async tx => {
      const session = await tx.session.findUnique({ where: { id: sessionId } });

      if (!session) {
        throw new NotFoundException('Session not found');
      }

      if (session.status !== SessionStatus.ACTIVE) {
        throw new BadRequestException('Session is not active');
      }

      const updatedBalance = new Prisma.Decimal(session.currentBalance).add(
        new Prisma.Decimal(delta),
      );

      if (options.enforceBalance !== false && updatedBalance.lt(0)) {
        throw new BadRequestException('Not enough session funds');
      }

      return await tx.session.update({
        where: { id: sessionId },
        data: { currentBalance: updatedBalance },
      });
    });

    this.eventsGateway.emitSessionNotification(updatedSession.userId, {
      type: 'SESSION_BALANCE_UPDATED',
      sessionId: updatedSession.id,
      balance: updatedSession.currentBalance,
    });

    return updatedSession;
  }

  async closeAllSessionsForUser(userId: string): Promise<void> {
    const activeSessions = await this.prisma.session.findMany({
      where: { userId, status: SessionStatus.ACTIVE },
      select: { id: true },
    });

    if (activeSessions.length === 0) {
      return;
    }

    await this.prisma.session.updateMany({
      where: { userId, status: SessionStatus.ACTIVE },
      data: {
        status: SessionStatus.CLOSED,
        currentBalance: 0,
        endedAt: new Date(),
      },
    });

    activeSessions.forEach(session => {
      this.eventsGateway.emitSessionNotification(userId, {
        type: 'SESSION_FORCE_CLOSED',
        sessionId: session.id,
        balance: 0,
      });
    });
  }
}
