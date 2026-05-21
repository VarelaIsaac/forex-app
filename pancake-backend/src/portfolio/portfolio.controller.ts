import { Controller, Get, Post, Body, UseGuards, Request, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PortfolioService } from './portfolio.service';
import { PayPalService } from './paypal.service';
import { UsersService } from '../users/users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TransactionType } from '@prisma/client';

type AuthenticatedRequest = {
  user: {
    userId: string;
    email: string;
    nombre?: string;
  };
};

type CapturedOrder = {
  status: string;
  amount: number;
  orderId: string;
};

@ApiTags('Portfolio')
@ApiBearerAuth('JWT-auth')
@Controller('portfolio')
@UseGuards(JwtAuthGuard)
export class PortfolioController {
  constructor(
    private portfolioService: PortfolioService,
    private paypalService: PayPalService,
    private usersService: UsersService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Get user portfolio',
    description: 'Retrieve portfolio balance and details for authenticated user',
  })
  @ApiResponse({
    status: 200,
    description: 'Portfolio retrieved successfully',
    schema: {
      example: {
        id: 1,
        userId: 1,
        balance: 10000.00,
        currency: 'USD',
        createdAt: '2026-02-17T12:00:00.000Z',
      },
    },
  })
  async getMyPortfolio(@Request() req: AuthenticatedRequest) {
    return await this.portfolioService.getPortfolioByUserId(req.user.userId);
  }

  @Get('transactions')
  @ApiOperation({
    summary: 'Get transaction history',
    description: 'Retrieve all deposit and withdrawal transactions',
  })
  @ApiResponse({ status: 200, description: 'Transaction history retrieved successfully' })
  async getTransactions(@Request() req: AuthenticatedRequest) {
    const portfolio = await this.portfolioService.getPortfolioByUserId(req.user.userId);
    return await this.portfolioService.getTransactionHistory(portfolio.id);
  }

  /**
   * Create a PayPal order for deposit
   */
  @Post('deposit/create-order')
  @ApiOperation({
    summary: 'Create PayPal deposit order',
    description: 'Initiate a deposit transaction via PayPal (uses demo mode if PayPal not configured)',
  })
  @ApiResponse({ status: 201, description: 'Deposit order created successfully' })
  async createDepositOrder(
    @Request() req: AuthenticatedRequest,
    @Body() body: { amount: number },
  ) {
    if (!this.paypalService.isConfigured()) {
      // For demo: directly add funds without PayPal
      const portfolio = await this.portfolioService.getPortfolioByUserId(req.user.userId);
      const transaction = await this.portfolioService.createTransaction(
        req.user.userId,
        portfolio.id,
        TransactionType.DEPOSIT,
        body.amount,
        'DEMO_' + Date.now(),
      );
      await this.portfolioService.completeTransaction(transaction.id);
      return { 
        success: true, 
        message: 'Demo deposit completed',
        transaction,
      };
    }

    const order = await this.paypalService.createOrder(body.amount);
    return order;
  }

  /**
   * Capture/complete a PayPal deposit
   */
  @Post('deposit/capture-order')
  @ApiOperation({
    summary: 'Capture PayPal deposit',
    description: 'Complete a PayPal deposit transaction and update portfolio balance',
  })
  @ApiResponse({ status: 200, description: 'Deposit captured successfully' })
  async captureDepositOrder(
    @Request() req: AuthenticatedRequest,
    @Body() body: { orderId: string },
  ) {
    const captureData = (await this.paypalService.captureOrder(
      body.orderId,
    )) as CapturedOrder;
    
    if (captureData.status === 'COMPLETED') {
      const portfolio = await this.portfolioService.getPortfolioByUserId(req.user.userId);
      const transaction = await this.portfolioService.createTransaction(
        req.user.userId,
        portfolio.id,
        TransactionType.DEPOSIT,
        captureData.amount,
        captureData.orderId,
      );
      await this.portfolioService.completeTransaction(transaction.id);
      
      return {
        success: true,
        transaction,
        captureData,
      };
    }

    return {
      success: false,
      message: 'Payment not completed',
      captureData,
    };
  }

  /**
   * Quick deposit without PayPal (for demo/testing)
   */
  @Post('deposit')
  @ApiOperation({
    summary: 'Quick deposit (demo mode)',
    description: 'Add funds directly to portfolio without PayPal integration',
  })
  @ApiResponse({ status: 201, description: 'Deposit completed successfully' })
  async deposit(
    @Request() req: AuthenticatedRequest,
    @Body() body: { amount: number },
  ) {
    const portfolio = await this.portfolioService.getPortfolioByUserId(req.user.userId);
    const transaction = await this.portfolioService.createTransaction(
      req.user.userId,
      portfolio.id,
      TransactionType.DEPOSIT,
      body.amount,
    );
    return await this.portfolioService.completeTransaction(transaction.id);
  }
  @ApiOperation({
    summary: 'Reset demo portfolio',
    description: 'Reset demo account balance to $10,000 and close all open trades (demo accounts only)',
  })
  @ApiResponse({
    status: 200,
    description: 'Demo portfolio reset successfully',
  })
  @ApiResponse({ status: 400, description: 'Only available for demo accounts' })
  
  /**
   * Reset demo portfolio to initial balance (demo accounts only)
   */
  @Post('reset-demo')
  async resetDemoPortfolio(@Request() req: AuthenticatedRequest) {
    const user = await this.usersService.findUserById(req.user.userId);
    
    if (!user) {
      throw new BadRequestException('User not found');
    }
    
    if (!user.isDemoAccount) {
      throw new BadRequestException('Portfolio reset is only available for demo accounts');
    }

    const portfolio = await this.portfolioService.resetDemoPortfolio(req.user.userId);
    return {
      success: true,
      message: 'Demo portfolio has been reset to $10,000',
      portfolio,
    };
  }
}
