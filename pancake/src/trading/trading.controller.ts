import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { TradingService } from './trading.service';
import { TwelveDataService, ForexQuote } from '../twelve-data/twelve-data.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OpenTradeDto, CloseTradeDto } from './dto';

@ApiTags('Trading')
@ApiBearerAuth('JWT-auth')
@Controller('trading')
@UseGuards(JwtAuthGuard)
export class TradingController {
  constructor(
    private tradingService: TradingService,
    private twelveDataService: TwelveDataService,
  ) {}

  /**
   * Get current forex price for a currency pair
   */
  @Get('price/:pair')
  @ApiOperation({ 
    summary: 'Get current price for a currency pair',
    description: 'Retrieve real-time forex price for a specific currency pair (e.g., EUR/USD)',
  })
  @ApiParam({ name: 'pair', example: 'EUR/USD', description: 'Currency pair (use URL encoding: EUR%2FUSD)' })
  @ApiResponse({ status: 200, description: 'Current price retrieved successfully' })
  async getPrice(@Param('pair') pair: string) {
    const price = await this.twelveDataService.getForexPrice(pair);
    return { pair, price };
  }

  /**
   * Get forex quotes for multiple pairs
   */
  @Get('quotes')
  @ApiOperation({ 
    summary: 'Get quotes for major currency pairs',
    description: 'Retrieve real-time quotes for commonly traded forex pairs (EUR/USD, GBP/USD, USD/JPY, etc.)',
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Quotes retrieved successfully',
    type: [Object],
  })
  async getQuotes(): Promise<ForexQuote[]> {
    const commonPairs = ['EUR/USD', 'GBP/USD', 'USD/JPY', 'USD/CHF', 'AUD/USD', 'USD/CAD'];
    const quotes = await this.twelveDataService.getMultipleQuotes(commonPairs);
    return quotes;
  }

  /**
   * Open a new trade
   */
  @Post('open')
  @ApiOperation({ 
    summary: 'Open a new trade position',
    description: 'Create a new forex trade. Specify currency pair, trade type (BUY/SELL), and investment amount.',
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Trade opened successfully',
    schema: {
      example: {
        id: 1,
        userId: 1,
        portfolioId: 1,
        currencyPair: 'EUR/USD',
        tradeType: 'BUY',
        amount: 1000,
        entryPrice: 1.0876,
        status: 'OPEN',
        openedAt: '2026-02-17T12:00:00.000Z',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Insufficient balance or invalid trade parameters' })
  async openTrade(@Request() req, @Body() openTradeDto: OpenTradeDto) {
    return await this.tradingService.openTrade(
      req.user.userId,
      openTradeDto.currencyPair,
      openTradeDto.tradeType,
      openTradeDto.amount,
    );
  }

  /**
   * Close an existing trade
   */
  @Post('close')
  @ApiOperation({ 
    summary: 'Close an open trade position',
    description: 'Close an existing trade at current market price and realize profit/loss',
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Trade closed successfully. Profit/loss calculated and added to portfolio balance.',
  })
  @ApiResponse({ status: 404, description: 'Trade not found or already closed' })
  async closeTrade(@Request() req, @Body() closeTradeDto: CloseTradeDto) {
    return await this.tradingService.closeTrade(
      req.user.userId,
      closeTradeDto.tradeId,
    );
  }

  /**
   * Get all trades for the current user
   */
  @Get('trades')
  @ApiOperation({ 
    summary: 'Get all user trades',
    description: 'Retrieve complete trading history (both open and closed trades)',
  })
  @ApiResponse({ status: 200, description: 'List of all trades' })
  async getTrades(@Request() req) {
    return await this.tradingService.getUserTrades(req.user.userId);
  }

  /**
   * Get open trades
   */
  @Get('trades/open')
  @ApiOperation({ 
    summary: 'Get open trades',
    description: 'Retrieve all currently active trades',
  })
  @ApiResponse({ status: 200, description: 'List of open trades' })
  async getOpenTrades(@Request() req) {
    return await this.tradingService.getOpenTrades(req.user.userId);
  }

  /**
   * Get closed trades (history)
   */
  @Get('trades/closed')
  @ApiOperation({ 
    summary: 'Get closed trades',
    description: 'Retrieve trading history (closed positions only)',
  })
  @ApiResponse({ status: 200, description: 'List of closed trades' })
  async getClosedTrades(@Request() req) {
    return await this.tradingService.getClosedTrades(req.user.userId);
  }

  /**
   * Get a specific trade by ID
   */
  @Get('trades/:id')
  @ApiOperation({ 
    summary: 'Get trade details',
    description: 'Retrieve detailed information about a specific trade',
  })
  @ApiParam({ name: 'id', description: 'Trade ID', example: 1 })
  @ApiResponse({ status: 200, description: 'Trade details' })
  @ApiResponse({ status: 404, description: 'Trade not found' })
  async getTradeById(@Request() req, @Param('id') id: string) {
    return await this.tradingService.getTradeById(req.user.userId, parseInt(id));
  }

  /**
   * Get current P/L for a trade
   */
  @Get('trades/:id/profit-loss')
  @ApiOperation({ 
    summary: 'Calculate current P/L for open trade',
    description: 'Get real-time profit/loss calculation for an open trade position',
  })
  @ApiParam({ name: 'id', description: 'Trade ID', example: 1 })
  @ApiResponse({ status: 200, description: 'Current profit/loss calculated' })
  async getCurrentProfitLoss(@Request() req, @Param('id') id: string) {
    const profitLoss = await this.tradingService.calculateCurrentProfitLoss(
      req.user.userId,
      parseInt(id),
    );
    return { tradeId: parseInt(id), profitLoss };
  }

  /**
   * Get trading analytics and performance metrics
   */
  @Get('analytics')
  @ApiOperation({ 
    summary: 'Get trading performance analytics',
    description: 'Comprehensive trading metrics including win rate, P/L breakdown, best/worst trades, and top performing pairs',
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Analytics data retrieved successfully',
    schema: {
      example: {
        totalTrades: 10,
        winningTrades: 6,
        losingTrades: 4,
        winRate: 60.0,
        totalProfit: 1250.50,
        totalLoss: 450.00,
        netProfitLoss: 800.50,
        averageProfitPerTrade: 80.05,
        bestTrade: { id: 5, currencyPair: 'EUR/USD', profitLoss: 325.50 },
        worstTrade: { id: 3, currencyPair: 'GBP/USD', profitLoss: -180.00 },
        bestPerformingPair: { pair: 'EUR/USD', trades: 5, totalProfitLoss: 520.25 },
      },
    },
  })
  async getAnalytics(@Request() req) {
    return await this.tradingService.getAnalytics(req.user.userId);
  }

  /**
   * Get portfolio growth history
   */
  @Get('portfolio-growth')
  @ApiOperation({ 
    summary: 'Get portfolio growth over time',
    description: 'Track portfolio balance changes throughout trading history',
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Portfolio growth data retrieved successfully',
  })
  async getPortfolioGrowth(@Request() req) {
    return await this.tradingService.getPortfolioGrowth(req.user.userId);
  }
}
