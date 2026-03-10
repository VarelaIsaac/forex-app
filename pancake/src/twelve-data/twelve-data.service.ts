/* eslint-disable prettier/prettier */
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

export interface ForexQuote {
  symbol: string;
  price: number;
  timestamp: number;
}

@Injectable()
export class TwelveDataService {
  private readonly apiKey: string;
  private readonly baseUrl = 'https://v6.exchangerate-api.com/v6';

  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {
    this.apiKey = this.configService.get<string>('EXCHANGERATE_API_KEY') || '';
  }

  /**
   * Get current forex price for a currency pair
   * @param pair - Currency pair (e.g., "EUR/USD")
   */
  async getForexPrice(pair: string): Promise<number> {
    try {
      const quote = await this.getForexQuote(pair);
      return quote.price;
    } catch (error) {
      throw new HttpException(
        `Failed to fetch forex price for ${pair}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * Get detailed forex quote
   * @param pair - Currency pair (e.g., "EUR/USD")
   */
  async getForexQuote(pair: string): Promise<ForexQuote> {
    if (!this.apiKey) {
      console.log('[MOCK MODE] No API key configured, using mock data');
      return this.getMockForexQuote(pair);
    }

    try {
      // Parse currency pair (e.g., "EUR/USD" -> from: EUR, to: USD)
      const [fromCurrency, toCurrency] = pair.split('/');
      
      const url = `${this.baseUrl}/${this.apiKey}/pair/${fromCurrency}/${toCurrency}`;
      const response = await this.httpService.axiosRef.get(url);

      const data = response.data;
      
      if (data.result === 'error') {
        console.error('ExchangeRate-API error:', data['error-type']);
        return this.getMockForexQuote(pair);
      }

      const conversionRate = parseFloat(data.conversion_rate);
      
      console.log(`[ExchangeRate-API] ${pair}: ${conversionRate}`);
      
      return {
        symbol: pair,
        price: conversionRate,
        timestamp: data.time_last_update_unix * 1000,
      };
    } catch (error) {
      console.error('Error fetching forex quote:', error.message);
      // Fallback to mock data on error
      return this.getMockForexQuote(pair);
    }
  }

  /**
   * Get exchange rate between two currencies
   * @param from - Base currency (e.g., "EUR")
   * @param to - Quote currency (e.g., "USD")
   */
  async getExchangeRate(from: string, to: string): Promise<number> {
    const pair = `${from}/${to}`;
    return await this.getForexPrice(pair);
  }

  /**
   * Get multiple forex quotes at once
   * @param pairs - Array of currency pairs
   */
  async getMultipleQuotes(pairs: string[]): Promise<ForexQuote[]> {
    const quotes = await Promise.all(
      pairs.map(pair => this.getForexQuote(pair)),
    );
    return quotes;
  }

  /**
   * Mock data for development/testing when API key is not available
   */
  private getMockForexQuote(pair: string): ForexQuote {
    const mockPrices: { [key: string]: number } = {
      'EUR/USD': 1.0876 + (Math.random() - 0.5) * 0.01,
      'GBP/USD': 1.2634 + (Math.random() - 0.5) * 0.01,
      'USD/JPY': 148.52 + (Math.random() - 0.5) * 1.0,
      'USD/CHF': 0.8754 + (Math.random() - 0.5) * 0.01,
      'AUD/USD': 0.6521 + (Math.random() - 0.5) * 0.01,
      'USD/CAD': 1.3542 + (Math.random() - 0.5) * 0.01,
      'NZD/USD': 0.6134 + (Math.random() - 0.5) * 0.01,
    };

    const price = mockPrices[pair] || 1.0;
    
    console.log(`[MOCK] Returning mock forex price for ${pair}: ${price}`);
    
    return {
      symbol: pair,
      price: parseFloat(price.toFixed(6)),
      timestamp: Date.now(),
    };
  }
}
