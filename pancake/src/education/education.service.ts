/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';

export interface GlossaryTerm {
  term: string;
  definition: string;
  example?: string;
}

export interface Tutorial {
  id: string;
  title: string;
  description: string;
  steps: TutorialStep[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface TutorialStep {
  stepNumber: number;
  title: string;
  content: string;
  tip?: string;
}

@Injectable()
export class EducationService {
  /**
   * Get forex trading glossary
   */
  getGlossary(): GlossaryTerm[] {
    return [
      {
        term: 'Forex',
        definition: 'Foreign Exchange - the global marketplace for trading national currencies against one another.',
        example: 'Trading EUR/USD means exchanging euros for US dollars.',
      },
      {
        term: 'Currency Pair',
        definition: 'Two currencies traded against each other. The first currency is the base, the second is the quote.',
        example: 'In EUR/USD, EUR is the base currency and USD is the quote currency.',
      },
      {
        term: 'Pip',
        definition: 'Point in Percentage - the smallest price move in forex, usually the fourth decimal place (0.0001).',
        example: 'If EUR/USD moves from 1.1000 to 1.1001, it moved 1 pip.',
      },
      {
        term: 'Spread',
        definition: 'The difference between the buying (ask) and selling (bid) price of a currency pair.',
        example: 'If EUR/USD bid is 1.1000 and ask is 1.1002, the spread is 2 pips.',
      },
      {
        term: 'Leverage',
        definition: 'Borrowing funds to increase trading position size beyond available capital.',
        example: '1:100 leverage means you can control $10,000 with just $100.',
      },
      {
        term: 'Long Position (Buy)',
        definition: 'Buying a currency pair expecting its value to increase.',
        example: 'Going long on EUR/USD means you expect the euro to strengthen against the dollar.',
      },
      {
        term: 'Short Position (Sell)',
        definition: 'Selling a currency pair expecting its value to decrease.',
        example: 'Going short on EUR/USD means you expect the euro to weaken against the dollar.',
      },
      {
        term: 'Stop Loss',
        definition: 'An order to automatically close a trade at a specific price to limit losses.',
        example: 'Setting a stop loss at 1.0950 when you buy EUR/USD at 1.1000 limits your loss to 50 pips.',
      },
      {
        term: 'Take Profit',
        definition: 'An order to automatically close a trade at a specific price to secure profits.',
        example: 'Setting take profit at 1.1050 when you buy at 1.1000 locks in 50 pips profit.',
      },
      {
        term: 'Margin',
        definition: 'The amount of money required to open and maintain a leveraged position.',
        example: 'With 1:100 leverage, you need $100 margin to control a $10,000 position.',
      },
      {
        term: 'Lot',
        definition: 'A standardized trading size. Standard lot = 100,000 units, Mini lot = 10,000 units, Micro lot = 1,000 units.',
        example: 'Trading 0.01 lots of EUR/USD means controlling 1,000 euros.',
      },
      {
        term: 'Volatility',
        definition: 'The degree of price fluctuation in a currency pair over time.',
        example: 'GBP/USD is often more volatile than EUR/USD, meaning it moves more in a day.',
      },
      {
        term: 'Liquidity',
        definition: 'How easily a currency can be bought or sold without affecting its price.',
        example: 'EUR/USD has high liquidity - you can trade large amounts with minimal price impact.',
      },
      {
        term: 'Bull Market',
        definition: 'A market condition where prices are rising or expected to rise.',
        example: 'A bull market in EUR/USD means the euro is strengthening against the dollar.',
      },
      {
        term: 'Bear Market',
        definition: 'A market condition where prices are falling or expected to fall.',
        example: 'A bear market in EUR/USD means the euro is weakening against the dollar.',
      },
    ];
  }

  /**
   * Get all tutorials
   */
  getTutorials(): Tutorial[] {
    return [
      {
        id: 'first-trade',
        title: 'Making Your First Trade',
        description: 'Learn how to open and close your first forex trade step by step.',
        difficulty: 'beginner',
        steps: [
          {
            stepNumber: 1,
            title: 'Choose a Currency Pair',
            content: 'Start with major pairs like EUR/USD or GBP/USD. These have high liquidity and lower spreads, making them ideal for beginners.',
            tip: 'Major currency pairs involve the US dollar and are the most traded globally.',
          },
          {
            stepNumber: 2,
            title: 'Analyze the Market',
            content: 'Look at the current price and recent price movements. Check if the price is generally going up (uptrend) or down (downtrend).',
            tip: 'Use the price chart to see patterns. Start with simple observations before learning technical analysis.',
          },
          {
            stepNumber: 3,
            title: 'Decide: Buy or Sell',
            content: 'If you think the base currency will strengthen, choose BUY (go long). If you think it will weaken, choose SELL (go short).',
            tip: 'In EUR/USD, buying means you expect EUR to rise against USD. Selling means you expect EUR to fall.',
          },
          {
            stepNumber: 4,
            title: 'Set Your Trade Amount',
            content: 'Start small! Risk only 1-2% of your total portfolio on a single trade. If you have $10,000, start with $100-200.',
            tip: 'Never risk money you cannot afford to lose. Demo accounts are great for practice!',
          },
          {
            stepNumber: 5,
            title: 'Open the Trade',
            content: 'Click the trade button to open your position. You will see your entry price and the current profit/loss in real-time.',
            tip: 'Write down why you made this trade. This helps you learn from both wins and losses.',
          },
          {
            stepNumber: 6,
            title: 'Monitor Your Trade',
            content: 'Watch how the price moves. Your P/L (Profit/Loss) will update as the market moves. Green means profit, red means loss.',
            tip: 'Avoid checking every second! Forex moves 24/5. Give your trade time to work.',
          },
          {
            stepNumber: 7,
            title: 'Close Your Trade',
            content: 'When you reach your profit target or want to cut losses, close the trade. The system will calculate your final P/L and update your balance.',
            tip: 'Having a plan before opening a trade helps you make rational decisions, not emotional ones.',
          },
        ],
      },
      {
        id: 'understanding-pairs',
        title: 'Understanding Currency Pairs',
        description: 'Learn how currency pairs work and how to read forex quotes.',
        difficulty: 'beginner',
        steps: [
          {
            stepNumber: 1,
            title: 'What is a Currency Pair?',
            content: 'Forex always involves two currencies. You cannot buy euros without selling another currency. Currency pairs show this relationship.',
            tip: 'Think of it as an exchange: "I give you X dollars, you give me Y euros."',
          },
          {
            stepNumber: 2,
            title: 'Base vs Quote Currency',
            content: 'The first currency (left) is the BASE currency. The second (right) is the QUOTE currency. EUR/USD = base/quote.',
            tip: 'The quote tells you how many units of quote currency equal 1 unit of base currency.',
          },
          {
            stepNumber: 3,
            title: 'Reading the Price',
            content: 'If EUR/USD = 1.1000, it means 1 euro equals 1.10 US dollars. When this number rises, the euro is strengthening.',
            tip: 'Higher price = stronger base currency. Lower price = weaker base currency.',
          },
          {
            stepNumber: 4,
            title: 'Major, Minor, and Exotic Pairs',
            content: 'Major pairs include USD (EUR/USD, GBP/USD). Minor pairs exclude USD (EUR/GBP). Exotic pairs involve emerging currencies (USD/TRY).',
            tip: 'Start with major pairs - they have better liquidity and lower costs.',
          },
          {
            stepNumber: 5,
            title: 'How Buying Works',
            content: 'Buying EUR/USD means you think EUR will strengthen (or USD will weaken). If EUR/USD rises from 1.1000 to 1.1100, you profit.',
            tip: 'BUY = betting the base currency goes UP relative to the quote currency.',
          },
          {
            stepNumber: 6,
            title: 'How Selling Works',
            content: 'Selling EUR/USD means you think EUR will weaken (or USD will strengthen). If EUR/USD falls from 1.1000 to 1.0900, you profit.',
            tip: 'SELL = betting the base currency goes DOWN relative to the quote currency.',
          },
        ],
      },
      {
        id: 'risk-management',
        title: 'Risk Management Basics',
        description: 'Learn how to protect your capital and manage risk like a professional trader.',
        difficulty: 'intermediate',
        steps: [
          {
            stepNumber: 1,
            title: 'The 2% Rule',
            content: 'Never risk more than 2% of your total capital on a single trade. If you have $10,000, risk no more than $200 per trade.',
            tip: 'This rule helps you survive losing streaks. Even 10 losses in a row only costs 20% of your capital.',
          },
          {
            stepNumber: 2,
            title: 'Position Sizing',
            content: 'Calculate how much to trade based on your account size and acceptable risk. Smaller positions = lower risk.',
            tip: 'Its better to make small consistent profits than big risky bets.',
          },
          {
            stepNumber: 3,
            title: 'Using Stop Loss Orders',
            content: 'Always set a stop loss before entering a trade. This automatically closes your trade if price moves against you.',
            tip: 'Think of stop loss as insurance for your trade. It costs nothing but saves you from disasters.',
          },
          {
            stepNumber: 4,
            title: 'Setting Take Profit Levels',
            content: 'Define your profit target before entering. This removes emotion from the decision to close a winning trade.',
            tip: 'A good rule: aim for profits at least 2x bigger than your risk (risk $100 to make $200+).',
          },
          {
            stepNumber: 5,
            title: 'Diversification',
            content: 'Do not put all your money in one trade or one currency pair. Spread your risk across multiple opportunities.',
            tip: 'If trading 3 pairs, make sure they are not highly correlated (avoid EUR/USD, EUR/GBP, and GBP/USD all at once).',
          },
          {
            stepNumber: 6,
            title: 'Emotional Control',
            content: 'The biggest risk is yourself. Stick to your plan, do not chase losses, and do not overtrade after wins.',
            tip: 'If you feel emotional (fear, greed, revenge), step away. Come back when you are thinking clearly.',
          },
        ],
      },
      {
        id: 'market-analysis',
        title: 'Introduction to Market Analysis',
        description: 'Learn the basics of analyzing forex markets to make informed trading decisions.',
        difficulty: 'intermediate',
        steps: [
          {
            stepNumber: 1,
            title: 'Two Types of Analysis',
            content: 'Fundamental Analysis studies economic factors (interest rates, employment, GDP). Technical Analysis studies price charts and patterns.',
            tip: 'Most beginners start with technical analysis because it is more visual and immediate.',
          },
          {
            stepNumber: 2,
            title: 'Understanding Trends',
            content: 'Prices move in trends: uptrend (higher highs and higher lows), downtrend (lower highs and lower lows), or sideways (range).',
            tip: 'The trend is your friend! Trading with the trend has higher probability of success.',
          },
          {
            stepNumber: 3,
            title: 'Support and Resistance',
            content: 'Support is a price level where buying pressure prevents further decline. Resistance is where selling pressure prevents further rise.',
            tip: 'Think of support as a floor and resistance as a ceiling. Breakouts beyond these levels can signal strong moves.',
          },
          {
            stepNumber: 4,
            title: 'Key Economic Indicators',
            content: 'Watch for major news: interest rate decisions, employment reports, inflation data, GDP releases. These can cause big market moves.',
            tip: 'Use an economic calendar to know when important news is released. Avoid trading right before major announcements if you are new.',
          },
          {
            stepNumber: 5,
            title: 'Trading Sessions',
            content: 'Forex trades 24 hours, 5 days a week. Main sessions: Asian (Tokyo), European (London), North American (New York). Overlaps are most active.',
            tip: 'London-New York overlap (8 AM - 12 PM EST) has highest volume and volatility.',
          },
          {
            stepNumber: 6,
            title: 'Developing Your Strategy',
            content: 'Combine analysis methods to create a trading plan. Define entry rules, exit rules, and risk management. Test your strategy consistently.',
            tip: 'Keep a trading journal. Record every trade: why you entered, what happened, what you learned.',
          },
        ],
      },
    ];
  }

  /**
   * Get a specific tutorial by ID
   */
  getTutorialById(id: string): Tutorial | null {
    const tutorials = this.getTutorials();
    return tutorials.find(t => t.id === id) || null;
  }

  /**
   * Get trading tips
   */
  getTradingTips(): string[] {
    return [
      'Start with a demo account to practice without risking real money.',
      'Never risk more than 1-2% of your capital on a single trade.',
      'Always use stop loss orders to protect your capital.',
      'Trade major currency pairs when starting out - they have lower spreads.',
      'Avoid trading during major news events until you gain experience.',
      'Keep a trading journal to track and learn from every trade.',
      'Do not overtrade - quality over quantity always wins.',
      'Take breaks after wins or losses to maintain emotional balance.',
      'Learn one strategy well before trying multiple approaches.',
      'Focus on protecting your capital first, making profits second.',
      'The best trades are the ones you do not take when conditions are not right.',
      'Backtesting your strategy on historical data builds confidence.',
      'Market conditions change - be flexible and adapt your strategy.',
      'Leverage amplifies both gains and losses - use it carefully.',
      'Consistency beats home runs - aim for steady, reliable profits.',
    ];
  }
}
