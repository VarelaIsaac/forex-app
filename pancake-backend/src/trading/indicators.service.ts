/* eslint-disable prettier/prettier */
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { RSI, MACD, BollingerBands } from 'technicalindicators';

export interface OHLCData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

export interface IndicatorData {
  rsi?: number[];
  macd?: {
    MACD: number[];
    signal: number[];
    histogram: number[];
  };
  bollingerBands?: {
    upper: number[];
    middle: number[];
    lower: number[];
  };
}

@Injectable()
export class IndicatorsService {
  private readonly frankfurterUrl = 'http://localhost:80/v1';

  constructor(private httpService: HttpService) {}

  /**
   * Fetch historical rates from Frankfurter (your Docker instance)
   * @param from - Base currency (e.g., 'EUR')
   * @param to - Quote currency (e.g., 'USD')
   * @param startDate - Start date (YYYY-MM-DD)
   * @param endDate - End date (YYYY-MM-DD)
   */
  async getHistoricalRates(
    from: string,
    to: string,
    startDate: string,
    endDate: string,
  ): Promise<OHLCData[]> {
    try {
      const url = `${this.frankfurterUrl}/${startDate}..${endDate}`;
      const response = await this.httpService.axiosRef.get(url, {
        params: { base: from, symbols: to },
      });

      const rates = response.data.rates as Record<string, Record<string, number>>;
      const ohlcData: OHLCData[] = [];

      // Convert Frankfurter data to OHLC format
      // Note: Frankfurter only provides daily close prices, so we simulate OHLC
      for (const [date, value] of Object.entries(rates)) {
        const rate = value[to] as number;
        if (rate) {
          ohlcData.push({
            date,
            open: rate,
            high: rate * 1.001, // Simulated high (0.1% above)
            low: rate * 0.999, // Simulated low (0.1% below)
            close: rate,
          });
        }
      }

      return ohlcData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    } catch (error: any) {
      console.error('Error fetching historical rates from Frankfurter:', error?.message || error);
      throw new HttpException(
        'Failed to fetch historical data from Frankfurter',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Calculate RSI (Relative Strength Index)
   * @param prices - Array of closing prices
   * @param period - RSI period (default: 14)
   */
  calculateRSI(prices: number[], period: number = 14): number[] {
    if (prices.length < period) {
      throw new HttpException(
        `Not enough data points for RSI calculation. Need at least ${period} values.`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const rsiInput = {
      values: prices,
      period,
    };

    return RSI.calculate(rsiInput);
  }

  /**
   * Calculate MACD (Moving Average Convergence Divergence)
   * @param prices - Array of closing prices
   * @param fastPeriod - Fast EMA period (default: 12)
   * @param slowPeriod - Slow EMA period (default: 26)
   * @param signalPeriod - Signal line period (default: 9)
   */
  calculateMACD(
    prices: number[],
    fastPeriod: number = 12,
    slowPeriod: number = 26,
    signalPeriod: number = 9,
  ): { MACD: number[]; signal: number[]; histogram: number[] } {
    if (prices.length < slowPeriod + signalPeriod) {
      throw new HttpException(
        `Not enough data points for MACD calculation. Need at least ${slowPeriod + signalPeriod} values.`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const macdInput = {
      values: prices,
      fastPeriod,
      slowPeriod,
      signalPeriod,
      SimpleMAOscillator: false,
      SimpleMASignal: false,
    };

    const macdData = MACD.calculate(macdInput);

    return {
      MACD: macdData.map(d => d.MACD || 0),
      signal: macdData.map(d => d.signal || 0),
      histogram: macdData.map(d => d.histogram || 0),
    };
  }

  /**
   * Calculate Bollinger Bands
   * @param prices - Array of closing prices
   * @param period - Period (default: 20)
   * @param stdDev - Standard deviation multiplier (default: 2)
   */
  calculateBollingerBands(
    prices: number[],
    period: number = 20,
    stdDev: number = 2,
  ): { upper: number[]; middle: number[]; lower: number[] } {
    if (prices.length < period) {
      throw new HttpException(
        `Not enough data points for Bollinger Bands calculation. Need at least ${period} values.`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const bbInput = {
      period,
      values: prices,
      stdDev,
    };

    const bbData = BollingerBands.calculate(bbInput);

    return {
      upper: bbData.map(d => d.upper || 0),
      middle: bbData.map(d => d.middle || 0),
      lower: bbData.map(d => d.lower || 0),
    };
  }

  /**
   * Get complete technical analysis for a currency pair
   * @param from - Base currency
   * @param to - Quote currency
   * @param days - Number of days of historical data (default: 90)
   */
  async getTechnicalAnalysis(
    from: string,
    to: string,
    days: number = 90,
  ): Promise<{
    ohlcData: OHLCData[];
    indicators: IndicatorData;
  }> {
    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const formatDate = (date: Date) => date.toISOString().split('T')[0];

    // Fetch historical data
    const ohlcData = await this.getHistoricalRates(
      from,
      to,
      formatDate(startDate),
      formatDate(endDate),
    );

    // Extract closing prices
    const closePrices = ohlcData.map(d => d.close);

    // Calculate all indicators
    const indicators: IndicatorData = {
      rsi: this.calculateRSI(closePrices, 14),
      macd: this.calculateMACD(closePrices, 12, 26, 9),
      bollingerBands: this.calculateBollingerBands(closePrices, 20, 2),
    };

    return {
      ohlcData,
      indicators,
    };
  }
}
