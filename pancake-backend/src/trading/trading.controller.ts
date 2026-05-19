import { Controller, Get, Post, Body, Param, UseGuards, Request, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { TradingService } from './trading.service';
import { IndicatorsService } from './indicators.service';
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
    private indicatorsService: IndicatorsService,
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
   * Get available currency pairs (with optional search)
   */
  @Get('pairs')
  @ApiOperation({
    summary: 'List currency pairs',
    description: 'Return available currency pairs, optionally filtered by query',
  })
  @ApiQuery({ name: 'q', required: false, description: 'Search query to filter pairs' })
  async getPairs(@Query('q') q?: string) {
    const all = [
      { symbol: 'EUR/USD', note: 'Most traded, tight spreads' },
      { symbol: 'GBP/USD', note: 'Fast moves, higher volatility' },
      { symbol: 'USD/JPY', note: 'Good for trend spotting' },
      { symbol: 'AUD/USD', note: 'Commodity-linked pair' },
      { symbol: 'USD/CAD', note: 'Oil-sensitive pair' },
      { symbol: 'NZD/USD', note: 'Lower liquidity, higher spreads' },
      { symbol: 'EUR/GBP', note: 'Cross pair for EUR and GBP' },
      { symbol: 'EUR/JPY', note: 'Popular cross with JPY' },
      { symbol: 'USD/CHF', note: 'Safe-haven pair' },
    ]

    const query = q?.trim().toLowerCase()
    const filtered = query
      ? all.filter((p) => p.symbol.toLowerCase().includes(query) || p.note.toLowerCase().includes(query))
      : all

    // Try to get live quotes for the filtered pairs; fallback to notes if quotes fail
    try {
      const symbols = filtered.map((p) => p.symbol)
      const quotes = await this.twelveDataService.getMultipleQuotes(symbols)
      // Merge notes with quotes
      return quotes.map((q) => {
        const found = filtered.find((f) => f.symbol === q.symbol)
        return { symbol: q.symbol, price: q.price, timestamp: q.timestamp, note: found?.note }
      })
    } catch (err) {
      // If quotes fail, return the filtered list with no price
      return filtered.map((p) => ({ symbol: p.symbol, note: p.note }))
    }
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
        sessionId: 3,
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
      openTradeDto.sessionId,
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

  /**
   * Get historical rates from Frankfurter
   */
  @Get('historical/:from/:to')
  @ApiOperation({ 
    summary: 'Get historical exchange rates',
    description: 'Retrieve historical forex data from Frankfurter (your Docker instance)',
  })
  @ApiParam({ name: 'from', example: 'EUR', description: 'Base currency' })
  @ApiParam({ name: 'to', example: 'USD', description: 'Quote currency' })
  @ApiQuery({ name: 'days', required: false, example: 90, description: 'Number of days of history (default: 90)' })
  @ApiResponse({ status: 200, description: 'Historical data retrieved successfully' })
  async getHistoricalRates(
    @Param('from') from: string,
    @Param('to') to: string,
    @Query('days') days?: string,
  ) {
    const numDays = days ? parseInt(days) : 90;
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - numDays);

    const formatDate = (date: Date) => date.toISOString().split('T')[0];

    return await this.indicatorsService.getHistoricalRates(
      from,
      to,
      formatDate(startDate),
      formatDate(endDate),
    );
  }

  /**
   * Get technical analysis with indicators (RSI, MACD, Bollinger Bands)
   */
  @Get('analysis/:from/:to')
  @ApiOperation({ 
    summary: 'Get complete technical analysis',
    description: 'Get historical data + RSI + MACD + Bollinger Bands for a currency pair',
  })
  @ApiParam({ name: 'from', example: 'EUR', description: 'Base currency' })
  @ApiParam({ name: 'to', example: 'USD', description: 'Quote currency' })
  @ApiQuery({ name: 'days', required: false, example: 90, description: 'Number of days of history (default: 90)' })
  @ApiResponse({ 
    status: 200, 
    description: 'Technical analysis data retrieved successfully',
    schema: {
      example: {
        ohlcData: [
          { date: '2026-01-01', open: 1.0876, high: 1.0887, low: 1.0865, close: 1.0876 },
        ],
        indicators: {
          rsi: [45.2, 52.3, 58.1],
          macd: {
            MACD: [0.0012, 0.0015, 0.0018],
            signal: [0.0010, 0.0012, 0.0014],
            histogram: [0.0002, 0.0003, 0.0004],
          },
          bollingerBands: {
            upper: [1.0920, 1.0925, 1.0930],
            middle: [1.0876, 1.0880, 1.0885],
            lower: [1.0832, 1.0835, 1.0840],
          },
        },
      },
    },
  })
  async getTechnicalAnalysis(
    @Param('from') from: string,
    @Param('to') to: string,
    @Query('days') days?: string,
  ) {
    const numDays = days ? parseInt(days) : 90;
    return await this.indicatorsService.getTechnicalAnalysis(from, to, numDays);
  }

  /**
   * Get RSI only
   */
  @Get('indicators/rsi/:from/:to')
  @ApiOperation({ 
    summary: 'Calculate RSI (Relative Strength Index)',
    description: 'Get RSI indicator values for a currency pair',
  })
  @ApiParam({ name: 'from', example: 'EUR', description: 'Base currency' })
  @ApiParam({ name: 'to', example: 'USD', description: 'Quote currency' })
  @ApiQuery({ name: 'period', required: false, example: 14, description: 'RSI period (default: 14)' })
  @ApiQuery({ name: 'days', required: false, example: 90, description: 'Number of days of history (default: 90)' })
  @ApiResponse({ status: 200, description: 'RSI values calculated successfully' })
  async getRSI(
    @Param('from') from: string,
    @Param('to') to: string,
    @Query('period') period?: string,
    @Query('days') days?: string,
  ) {
    const rsiPeriod = period ? parseInt(period) : 14;
    const numDays = days ? parseInt(days) : 90;

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - numDays);

    const formatDate = (date: Date) => date.toISOString().split('T')[0];

    const historicalData = await this.indicatorsService.getHistoricalRates(
      from,
      to,
      formatDate(startDate),
      formatDate(endDate),
    );

    const closePrices = historicalData.map(d => d.close);
    const rsi = this.indicatorsService.calculateRSI(closePrices, rsiPeriod);

    return { rsi, dates: historicalData.slice(-rsi.length).map(d => d.date) };
  }
}
