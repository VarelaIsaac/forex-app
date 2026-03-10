/* eslint-disable prettier/prettier */
import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * PayPal Service - Simplified for demo purposes
 * 
 * For production use, integrate with PayPal REST API:
 * - https://developer.paypal.com/docs/api/overview/
 * - Use @paypal/paypal-server-sdk for full integration
 * 
 * This demo version simulates PayPal transactions for testing
 */
@Injectable()
export class PayPalService {
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly mode: string;

  constructor(private configService: ConfigService) {
    this.clientId = this.configService.get<string>('PAYPAL_CLIENT_ID') || '';
    this.clientSecret = this.configService.get<string>('PAYPAL_CLIENT_SECRET') || '';
    this.mode = this.configService.get<string>('PAYPAL_MODE') || 'sandbox';

    if (this.isConfigured()) {
      console.log(`✅ PayPal configured in ${this.mode} mode (Demo)`);
    } else {
      console.warn('⚠️  PayPal credentials not configured. Using demo mode.');
    }
  }

  /**
   * Create a PayPal order for deposit (Demo version)
   */
  async createOrder(amount: number, currency: string = 'USD'): Promise<any> {
    // Simulate PayPal order creation
    const orderId = `DEMO_ORDER_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      orderId,
      status: 'CREATED',
      amount,
      currency,
      links: [
        {
          rel: 'approve',
          href: `https://www.sandbox.paypal.com/checkoutnow?token=${orderId}`,
        },
      ],
      message: 'Demo order created. In production, user would be redirected to PayPal.',
    };
  }

  /**
   * Capture/complete a PayPal order (Demo version)
   */
  async captureOrder(orderId: string): Promise<any> {
    // Simulate PayPal order capture
    // In production, this would call PayPal API to capture the payment
    
    return {
      orderId,
      status: 'COMPLETED',
      captureId: `CAPTURE_${Date.now()}`,
      amount: 0, // Would be extracted from actual PayPal response
      currency: 'USD',
      message: 'Demo capture completed. In production, this would process real payment.',
    };
  }

  /**
   * Get order details (Demo version)
   */
  async getOrderDetails(orderId: string): Promise<any> {
    return {
      orderId,
      status: 'COMPLETED',
      message: 'Demo order details',
    };
  }

  /**
   * Check if PayPal is configured
   */
  isConfigured(): boolean {
    return !!(this.clientId && this.clientSecret);
  }
}

