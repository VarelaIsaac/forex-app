/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Trade, TradeType, TradeStatus, SessionStatus } from '@prisma/client';
import { TwelveDataService } from '../twelve-data/twelve-data.service';
import { PortfolioService } from '../portfolio/portfolio.service';
import { EventsGateway } from '../events/events.gateway';
import { SessionsService } from '../sessions/sessions.service';

@Injectable()
export class TradingService {
  constructor(
    private prisma: PrismaService,
    private twelveDataService: TwelveDataService,
    private portfolioService: PortfolioService,
    private sessionsService: SessionsService,
    private eventsGateway: EventsGateway,
  ) {}

  /**
   * Open a new trade position
   */
  async openTrade(
    userId: string,
    currencyPair: string,
    tradeType: TradeType,
    amount: number,
    sessionId?: number,
  ): Promise<Trade> {
    let portfolioId: number;
    let fundingSessionId: number | null = null;
    let rollback: (() => Promise<void>) | null = null;

    if (sessionId) {
      const session = await this.sessionsService.getSessionSummary(userId, sessionId);

      if (session.status !== SessionStatus.ACTIVE) {
        throw new BadRequestException('Session is not active');
      }

      if (Number(session.currentBalance) < amount) {
        throw new BadRequestException('Insufficient session balance to open trade');
      }

      portfolioId = session.portfolioId;
      fundingSessionId = session.id;
      rollback = async () => {
        await this.sessionsService.creditSession(session.id, amount);
      };
      await this.sessionsService.debitSession(session.id, amount);
    } else {
      const portfolio = await this.portfolioService.getPortfolioByUserId(userId);

      if (Number(portfolio.balance) < amount) {
        throw new BadRequestException('Insufficient balance to open trade');
      }

      portfolioId = portfolio.id;
      rollback = async () => {
        await this.portfolioService.updateBalance(portfolio.id, amount);
      };
      await this.portfolioService.updateBalance(portfolio.id, -amount);
    }

    const currentPrice = await this.twelveDataService.getForexPrice(currencyPair);

    try {
      const savedTrade = await this.prisma.trade.create({
        data: {
          userId,
          portfolioId,
          sessionId: fundingSessionId,
          currencyPair,
          tradeType,
          amount,
          entryPrice: currentPrice,
          status: TradeStatus.OPEN,
        },
      });

      await this.prisma.user.update({
        where: { id: userId },
        data: { tradeCount: { increment: 1 } },
      });

      console.log(`Trade opened: ${tradeType} ${amount} ${currencyPair} @ ${currentPrice}`);

      this.eventsGateway.emitTradeNotification(userId, {
        type: 'TRADE_OPENED',
        trade: savedTrade,
      });

      return savedTrade;
    } catch (error) {
      if (rollback) {
        await rollback();
      }
      throw error;
    }
  }

  /**
   * Close an existing trade position
   */
  async closeTrade(userId: string, tradeId: number): Promise<Trade> {
    // Find the trade
    const trade = await this.prisma.trade.findFirst({
      where: { id: tradeId, userId },
    });

    if (!trade) {
      throw new NotFoundException('Trade not found');
    }

    if (trade.status === TradeStatus.CLOSED) {
      throw new BadRequestException('Trade is already closed');
    }

    // Get current market price
    const currentPrice = await this.twelveDataService.getForexPrice(trade.currencyPair);

    // Calculate profit/loss
    const profitLoss = this.calculateProfitLoss(
      trade.tradeType,
      Number(trade.amount),
      Number(trade.entryPrice),
      currentPrice,
    );

    // Update trade
    const closedTrade = await this.prisma.trade.update({
      where: { id: tradeId },
      data: {
        exitPrice: currentPrice,
        profitLoss,
        status: TradeStatus.CLOSED,
        closedAt: new Date(),
      },
    });

    // Return initial amount + profit/loss to the funding wallet
    let returnAmount = Number(trade.amount) + profitLoss;
    if (returnAmount < 0) {
      returnAmount = 0;
    }

    if (trade.sessionId) {
      if (returnAmount > 0) {
        await this.sessionsService.creditSession(trade.sessionId, returnAmount);
      }
    } else if (returnAmount !== 0) {
      await this.portfolioService.updateBalance(trade.portfolioId, returnAmount);
    }

    console.log(`Trade closed: ${trade.tradeType} ${trade.currencyPair} P/L: ${profitLoss}`);

    // Emit WebSocket notification
    this.eventsGateway.emitTradeNotification(userId, {
      type: 'TRADE_CLOSED',
      trade: closedTrade,
      profitLoss,
    });

    return closedTrade;
  }

  /**
   * Get all trades for a user
   */
  async getUserTrades(userId: string): Promise<Trade[]> {
    return await this.prisma.trade.findMany({
      where: { userId },
      orderBy: { openedAt: 'desc' },
    });
  }

  /**
   * Get open trades for a user
   */
  async getOpenTrades(userId: string): Promise<Trade[]> {
    return await this.prisma.trade.findMany({
      where: { userId, status: TradeStatus.OPEN },
      orderBy: { openedAt: 'desc' },
    });
  }

  /**
   * Get closed trades for a user
   */
  async getClosedTrades(userId: string): Promise<Trade[]> {
    return await this.prisma.trade.findMany({
      where: { userId, status: TradeStatus.CLOSED },
      orderBy: { closedAt: 'desc' },
    });
  }

  /**
   * Get a specific trade by ID
   */
  async getTradeById(userId: string, tradeId: number): Promise<Trade> {
    const trade = await this.prisma.trade.findFirst({
      where: { id: tradeId, userId },
    });

    if (!trade) {
      throw new NotFoundException('Trade not found');
    }

    return trade;
  }

  /**
   * Calculate current P/L for open trades
   */
  async calculateCurrentProfitLoss(userId: string, tradeId: number): Promise<number> {
    const trade = await this.getTradeById(userId, tradeId);

    if (trade.status === TradeStatus.CLOSED) {
      return Number(trade.profitLoss);
    }

    // Get current price
    const currentPrice = await this.twelveDataService.getForexPrice(trade.currencyPair);

    return this.calculateProfitLoss(
      trade.tradeType,
      Number(trade.amount),
      Number(trade.entryPrice),
      currentPrice,
    );
  }

  /**
   * Calculate profit/loss based on trade type and price movement
   */
  private calculateProfitLoss(
    tradeType: TradeType,
    amount: number,
    entryPrice: number,
    exitPrice: number,
  ): number {
    const priceChange = exitPrice - entryPrice;
    const percentageChange = priceChange / entryPrice;

    // For BUY: profit when price goes up
    // For SELL: profit when price goes down
    const multiplier = tradeType === TradeType.BUY ? 1 : -1;
    const profitLoss = amount * percentageChange * multiplier;

    return parseFloat(profitLoss.toFixed(2));
  }

  /**
   * Get trading analytics and metrics for a user
   */
  async getAnalytics(userId: string) {
    const allTrades = await this.getUserTrades(userId);
    const closedTrades = allTrades.filter(t => t.status === TradeStatus.CLOSED);
    
    if (closedTrades.length === 0) {
      return {
        totalTrades: 0,
        winRate: 0,
        totalProfit: 0,
        totalLoss: 0,
        netProfitLoss: 0,
        averageProfitPerTrade: 0,
        bestTrade: null,
        worstTrade: null,
        bestPerformingPair: null,
      };
    }

    // Calculate wins and losses
    const winningTrades = closedTrades.filter(t => Number(t.profitLoss) > 0);
    const losingTrades = closedTrades.filter(t => Number(t.profitLoss) < 0);
    const winRate = (winningTrades.length / closedTrades.length) * 100;

    // Calculate profit/loss totals
    const totalProfit = winningTrades.reduce((sum, t) => sum + Number(t.profitLoss), 0);
    const totalLoss = Math.abs(losingTrades.reduce((sum, t) => sum + Number(t.profitLoss), 0));
    const netProfitLoss = totalProfit - totalLoss;
    const averageProfitPerTrade = netProfitLoss / closedTrades.length;

    // Find best and worst trades
    const sortedByPL = [...closedTrades].sort((a, b) => Number(b.profitLoss) - Number(a.profitLoss));
    const bestTrade = sortedByPL[0];
    const worstTrade = sortedByPL[sortedByPL.length - 1];

    // Calculate best performing currency pair
    const pairPerformance = new Map<string, { trades: number; totalPL: number }>();
    closedTrades.forEach(trade => {
      const existing = pairPerformance.get(trade.currencyPair) || { trades: 0, totalPL: 0 };
      pairPerformance.set(trade.currencyPair, {
        trades: existing.trades + 1,
        totalPL: existing.totalPL + Number(trade.profitLoss),
      });
    });

    let bestPair: { pair: string; trades: number; totalProfitLoss: number } | null = null;
    let bestPairPL = -Infinity;
    pairPerformance.forEach((data, pair) => {
      if (data.totalPL > bestPairPL) {
        bestPairPL = data.totalPL;
        bestPair = { pair, trades: data.trades, totalProfitLoss: data.totalPL };
      }
    });

    return {
      totalTrades: closedTrades.length,
      winningTrades: winningTrades.length,
      losingTrades: losingTrades.length,
      winRate: parseFloat(winRate.toFixed(2)),
      totalProfit: parseFloat(totalProfit.toFixed(2)),
      totalLoss: parseFloat(totalLoss.toFixed(2)),
      netProfitLoss: parseFloat(netProfitLoss.toFixed(2)),
      averageProfitPerTrade: parseFloat(averageProfitPerTrade.toFixed(2)),
      bestTrade: bestTrade ? {
        id: bestTrade.id,
        currencyPair: bestTrade.currencyPair,
        tradeType: bestTrade.tradeType,
        profitLoss: Number(bestTrade.profitLoss),
        openedAt: bestTrade.openedAt,
      } : null,
      worstTrade: worstTrade ? {
        id: worstTrade.id,
        currencyPair: worstTrade.currencyPair,
        tradeType: worstTrade.tradeType,
        profitLoss: Number(worstTrade.profitLoss),
        openedAt: worstTrade.openedAt,
      } : null,
      bestPerformingPair: bestPair,
    };
  }

  /**
   * Get portfolio growth history
   */
  async getPortfolioGrowth(userId: string) {
    const portfolio = await this.portfolioService.getPortfolioByUserId(userId);
    const allTrades = await this.getUserTrades(userId);
    const closedTrades = allTrades.filter(t => t.status === TradeStatus.CLOSED && t.closedAt !== null)
      .sort((a, b) => a.closedAt!.getTime() - b.closedAt!.getTime());

    // Start with initial balance and track how it changed over time
    let runningBalance = 10000; // Assuming starting balance
    const growthHistory: Array<{ date: Date; balance: number; tradeId: number | null }> = [{
      date: portfolio.createdAt || new Date(),
      balance: runningBalance,
      tradeId: null,
    }];

    closedTrades.forEach(trade => {
      runningBalance += Number(trade.profitLoss);
      growthHistory.push({
        date: trade.closedAt!,
        balance: parseFloat(runningBalance.toFixed(2)),
        tradeId: trade.id,
      });
    });

    // Add current balance as the latest point
    growthHistory.push({
      date: new Date(),
      balance: Number(portfolio.balance),
      tradeId: null,
    });

    return {
      currentBalance: Number(portfolio.balance),
      startingBalance: 10000,
      totalGrowth: Number(portfolio.balance) - 10000,
      growthPercentage: ((Number(portfolio.balance) - 10000) / 10000) * 100,
      history: growthHistory,
    };
  }
}

