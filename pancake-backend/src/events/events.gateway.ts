/* eslint-disable prettier/prettier */
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { TwelveDataService } from '../twelve-data/twelve-data.service';

@WebSocketGateway({
  cors: {
    origin: '*', // Configure this properly in production
  },
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private subscribedPairs: Map<string, Set<string>> = new Map(); // clientId -> Set of pairs
  private priceUpdateInterval: NodeJS.Timeout;

  constructor(private twelveDataService: TwelveDataService) {}

  afterInit() {
    console.log('✅ WebSocket Gateway initialized');
    // Start broadcasting price updates every 5 seconds
    this.startPriceUpdates();
  }

  handleConnection(client: Socket) {
    console.log(`🔌 Client connected: ${client.id}`);
    this.subscribedPairs.set(client.id, new Set());
  }

  handleDisconnect(client: Socket) {
    console.log(`🔌 Client disconnected: ${client.id}`);
    this.subscribedPairs.delete(client.id);
  }

  /**
   * Subscribe to price updates for specific currency pairs
   */
  @SubscribeMessage('subscribe_prices')
  handleSubscribePrices(
    @MessageBody() data: { pairs: string[] },
    @ConnectedSocket() client: Socket,
  ) {
    const clientPairs = this.subscribedPairs.get(client.id) || new Set();
    data.pairs.forEach(pair => clientPairs.add(pair));
    this.subscribedPairs.set(client.id, clientPairs);
    
    console.log(`📊 Client ${client.id} subscribed to: ${data.pairs.join(', ')}`);
    
    return { success: true, subscribed: data.pairs };
  }

  /**
   * Unsubscribe from price updates
   */
  @SubscribeMessage('unsubscribe_prices')
  handleUnsubscribePrices(
    @MessageBody() data: { pairs: string[] },
    @ConnectedSocket() client: Socket,
  ) {
    const clientPairs = this.subscribedPairs.get(client.id);
    if (clientPairs) {
      data.pairs.forEach(pair => clientPairs.delete(pair));
    }
    
    console.log(`📊 Client ${client.id} unsubscribed from: ${data.pairs.join(', ')}`);
    
    return { success: true, unsubscribed: data.pairs };
  }

  /**
   * Start broadcasting price updates
   */
  private startPriceUpdates() {
    this.priceUpdateInterval = setInterval(async () => {
      // Collect all unique pairs that clients are subscribed to
      const allPairs = new Set<string>();
      this.subscribedPairs.forEach(pairs => {
        pairs.forEach(pair => allPairs.add(pair));
      });

      if (allPairs.size === 0) return;

      try {
        // Fetch quotes for all subscribed pairs
        const quotes = await this.twelveDataService.getMultipleQuotes(Array.from(allPairs));
        
        // Send updates to each client based on their subscriptions
        this.subscribedPairs.forEach((subscribedPairs, clientId) => {
          const clientQuotes = quotes.filter(q => subscribedPairs.has(q.symbol));
          if (clientQuotes.length > 0) {
            this.server.to(clientId).emit('price_update', clientQuotes);
          }
        });
      } catch (error) {
        console.error('Error fetching price updates:', error);
      }
    }, 5000); // Update every 5 seconds
  }

  /**
   * Emit portfolio update to a specific user
   */
  emitPortfolioUpdate(userId: string, portfolioData: any) {
    this.server.emit(`portfolio_update_${userId}`, portfolioData);
  }

  /**
   * Emit trade execution notification
   */
  emitTradeNotification(userId: string, tradeData: any) {
    this.server.emit(`trade_notification_${userId}`, tradeData);
  }

  /**
   * Emit transaction notification
   */
  emitTransactionNotification(userId: string, transactionData: any) {
    this.server.emit(`transaction_notification_${userId}`, transactionData);
  }
}

