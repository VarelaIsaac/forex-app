/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Portfolio, Transaction, Trade } from '@prisma/client';
import { TransactionType, TransactionStatus } from '@prisma/client';
import { TradeStatus } from '@prisma/client';
import { EventsGateway } from '../events/events.gateway';
import { SessionsService } from '../sessions/sessions.service';

@Injectable()
export class PortfolioService {
  constructor(
    private prisma: PrismaService,
    private eventsGateway: EventsGateway,
    private sessionsService: SessionsService,
  ) {}

  /**
   * Create a new portfolio for a user
   */
  async createPortfolio(userId: string, initialBalance: number = 10000): Promise<Portfolio> {
    return await this.prisma.portfolio.create({
      data: {
        userId,
        balance: initialBalance,
        currency: 'USD',
      },
    });
  }

  /**
   * Get portfolio by user ID
   */
  async getPortfolioByUserId(userId: string): Promise<Portfolio & { trades: Trade[]; transactions: Transaction[] }> {
    const portfolio = await this.prisma.portfolio.findFirst({
      where: { userId },
      include: {
        trades: true,
        transactions: true,
      },
    });
    
    if (!portfolio) {
      throw new NotFoundException('Portfolio not found');
    }
    
    return portfolio;
  }

  /**
   * Get portfolio by ID
   */
  async getPortfolioById(portfolioId: number): Promise<Portfolio & { trades: Trade[]; transactions: Transaction[] }> {
    const portfolio = await this.prisma.portfolio.findUnique({
      where: { id: portfolioId },
      include: {
        trades: true,
        transactions: true,
      },
    });
    
    if (!portfolio) {
      throw new NotFoundException('Portfolio not found');
    }
    
    return portfolio;
  }

  /**
   * Update portfolio balance
   */
  async updateBalance(portfolioId: number, amount: number): Promise<Portfolio> {
    const portfolio = await this.prisma.portfolio.findUnique({ where: { id: portfolioId } });
    if (!portfolio) {
      throw new NotFoundException('Portfolio not found');
    }
    
    const newBalance = Number(portfolio.balance) + amount;
    return await this.prisma.portfolio.update({
      where: { id: portfolioId },
      data: { balance: newBalance },
    });
  }

  /**
   * Create a transaction (deposit/withdrawal)
   */
  async createTransaction(
    userId: string,
    portfolioId: number,
    type: TransactionType,
    amount: number,
    paypalOrderId?: string,
  ): Promise<Transaction> {
    return await this.prisma.transaction.create({
      data: {
        userId,
        portfolioId,
        type,
        amount,
        status: TransactionStatus.PENDING,
        paypalOrderId,
      },
    });
  }

  /**
   * Complete a transaction and update balance
   */
  async completeTransaction(transactionId: number): Promise<Transaction> {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id: transactionId },
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    const updatedTransaction = await this.prisma.transaction.update({
      where: { id: transactionId },
      data: { status: TransactionStatus.COMPLETED },
    });

    // Update portfolio balance
    const amountChange = transaction.type === TransactionType.DEPOSIT 
      ? Number(transaction.amount) 
      : -Number(transaction.amount);
    
    await this.updateBalance(transaction.portfolioId, amountChange);

    // Emit WebSocket notification
    this.eventsGateway.emitTransactionNotification(transaction.userId, {
      type: 'TRANSACTION_COMPLETED',
      transaction: updatedTransaction,
    });

    return updatedTransaction;
  }

  /**
   * Get transaction history for a portfolio
   */
  async getTransactionHistory(portfolioId: number): Promise<Transaction[]> {
    return await this.prisma.transaction.findMany({
      where: { portfolioId },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Reset demo portfolio balance to initial amount and close all trades
   * Can only be used for demo accounts
   */
  async resetDemoPortfolio(userId: string, initialBalance: number = 10000): Promise<Portfolio> {
    const portfolio = await this.getPortfolioByUserId(userId);

    // Close any active custom sessions and zero their balances
    await this.sessionsService.closeAllSessionsForUser(userId);

    // Close all open trades for this portfolio
    const openTrades = await this.prisma.trade.findMany({
      where: { 
        portfolioId: portfolio.id, 
        status: TradeStatus.OPEN 
      },
    });

    for (const trade of openTrades) {
      await this.prisma.trade.update({
        where: { id: trade.id },
        data: {
          status: TradeStatus.CLOSED,
          closedAt: new Date(),
          exitPrice: trade.entryPrice,
          profitLoss: 0,
        },
      });
    }

    // Reset balance
    const updatedPortfolio = await this.prisma.portfolio.update({
      where: { id: portfolio.id },
      data: { balance: initialBalance },
    });

    // Emit WebSocket notification
    this.eventsGateway.emitPortfolioUpdate(userId, {
      type: 'DEMO_PORTFOLIO_RESET',
      balance: initialBalance,
    });

    return updatedPortfolio;
  }
}
