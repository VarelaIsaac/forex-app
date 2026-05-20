"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { useUser } from "@auth0/nextjs-auth0/client"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { HelpPanel } from "@/components/dashboard/help-panel"
import { TutorialGuide, type TutorialStep } from "@/components/tutorial/tutorial-guide"
import { useTranslate } from "@/hooks/use-translate"
import { useLearning } from "@/hooks/use-learning"

const lessonContent: Record<
  string,
  {
    title: string
    description: string
    fullDescription: string
    steps: TutorialStep[]
  }
> = {
  "forex-basics": {
    title: "Forex Basics",
    description: "Understand how currency pairs move.",
    fullDescription:
      "In this lesson, you'll learn the fundamentals of forex trading, including currency pairs, pips, and how prices move in the market.",
    steps: [
      {
        title: "What is Forex?",
        description:
          "Forex is the foreign exchange market where currencies are traded. Every trade involves buying one currency and selling another, like EUR/USD.",
        action: "Click on the Markets section to see live currency pairs in action",
        elementSelector: "[href='/markets']",
      },
      {
        title: "Currency Pairs Explained",
        description:
          "Currency pairs always have two parts: the base currency (first) and quote currency (second). For example, in EUR/USD, EUR is the base and USD is the quote.",
        action: "Notice how each price shows the base/quote pair format",
        elementSelector: ".trading-pair-display",
      },
      {
        title: "Understanding Pips",
        description:
          "A pip is the smallest price move in forex. Most pairs move in increments of 0.0001 (4 decimal places). One pip = 0.0001 for most pairs.",
        action: "Watch how prices change in small increments during market hours",
      },
      {
        title: "Bid and Ask Prices",
        description:
          "Every quote has a bid price (what sellers want) and an ask price (what buyers want). When you buy, you pay the ask. When you sell, you receive the bid.",
        action: "Remember: Always buy at the ask and sell at the bid",
      },
    ],
  },
  "risk-control": {
    title: "Risk Control",
    description: "Learn how to protect your balance.",
    fullDescription:
      "Discover the essential principles of risk management to protect your trading account and maximize long-term profitability.",
    steps: [
      {
        title: "The 1% Rule",
        description:
          "Never risk more than 1% of your account balance on a single trade. This helps you survive losing streaks and stay in the game long-term.",
        action: "Calculate: If you have $10,000, don't risk more than $100 per trade",
        elementSelector: "[data-stats-balance]",
      },
      {
        title: "Lot Sizing",
        description:
          "Your lot size determines how much money is at risk. Smaller lots = less risk. Start with 0.01 lots until you're confident and profitable.",
        action: "Try placing a 0.01 lot trade to see how risk is calculated",
        elementSelector: "[data-trade-size-input]",
      },
      {
        title: "Stop Loss Orders",
        description:
          "Always set a stop loss before entering a trade. This automatically closes your position if the price moves against you beyond your risk tolerance.",
        action: "In the Trade section, note the stop loss field before executing",
        elementSelector: "[href='/trade']",
      },
      {
        title: "Risk/Reward Ratio",
        description:
          "Aim for a 1:2 or better risk/reward ratio. For every $1 you risk, you should aim to make at least $2 in profit.",
        action: "Plan your trades with good risk/reward before entering",
      },
    ],
  },
  "reading-charts": {
    title: "Reading Charts",
    description: "Spot trends with simple visuals.",
    fullDescription:
      "Learn to interpret price charts and identify market trends to make informed trading decisions.",
    steps: [
      {
        title: "Chart Types",
        description:
          "Candlestick charts show open, high, low, and close prices for each time period. Green candles = price went up, red candles = price went down.",
        action: "Look at the Markets section to see live candlestick charts",
        elementSelector: "[href='/markets']",
      },
      {
        title: "Uptrends and Downtrends",
        description:
          "In an uptrend, prices make higher highs and higher lows. In a downtrend, prices make lower highs and lower lows. Trade WITH the trend for better odds.",
        action: "Observe several currency pairs to spot trend patterns",
      },
      {
        title: "Key Levels",
        description:
          "Support levels are where prices tend to stop falling. Resistance levels are where prices tend to stop rising. Trading near these levels often offers good entry points.",
        action: "Mark support and resistance zones on your charts",
      },
      {
        title: "Volume and Momentum",
        description:
          "Large price moves with high volume are stronger signals. Small moves with low volume may be false. Always check volume when reading charts.",
        action: "Compare trades with different volume levels to understand the difference",
      },
    ],
  },
  "candlestick-patterns": {
    title: "Candlestick Patterns",
    description: "Recognize price action signals.",
    fullDescription:
      "Master common candlestick patterns that signal potential price reversals or continuations.",
    steps: [
      {
        title: "The Doji Candle",
        description:
          "A Doji candle has an open and close at nearly the same price, creating a small body with long wicks. It signals indecision in the market.",
        action: "Watch for Doji candles in the Markets section",
        elementSelector: "[href='/markets']",
      },
      {
        title: "Hammer and Hanging Man",
        description:
          "A Hammer has a small body at the top with a long wick below. It signals a potential reversal from downtrend to uptrend. Hanging Man is the opposite - reversal from uptrend to down.",
        action: "Practice identifying these patterns on historical charts",
      },
      {
        title: "Engulfing Patterns",
        description:
          "A bullish engulfing has a small red candle followed by a larger green candle that completely covers it. This signals a potential upward reversal.",
        action: "Look for both bullish and bearish engulfing patterns in your trades",
      },
      {
        title: "Using Patterns in Trading",
        description:
          "Candlestick patterns are most reliable when combined with support/resistance levels. Never trade a pattern in isolation - confirm with trend and levels.",
        action: "Before your next trade, identify a pattern and a key level to confirm entry",
      },
    ],
  },
  "support-resistance": {
    title: "Support & Resistance",
    description: "Find key price levels that matter.",
    fullDescription:
      "Identify and use support and resistance levels to determine optimal entry and exit points for your trades.",
    steps: [
      {
        title: "What is Support?",
        description:
          "Support is a price level where an asset tends to stop falling and bounce upward. It's like a floor beneath the price. Buyers step in at support levels.",
        action: "Watch prices bounce off support in the Markets section",
        elementSelector: "[href='/markets']",
      },
      {
        title: "What is Resistance?",
        description:
          "Resistance is a price level where an asset tends to stop rising and fall downward. It's like a ceiling above the price. Sellers step in at resistance levels.",
        action: "Observe prices being rejected at resistance levels",
      },
      {
        title: "Finding Support and Resistance",
        description:
          "Look at historical price charts. Where has the price bounced multiple times? Those are key support/resistance zones. More touches = stronger level.",
        action: "Mark at least 2 support and 2 resistance levels on your chart",
      },
      {
        title: "Trading the Levels",
        description:
          "Buy near support when the trend is up. Sell near resistance when the trend is down. When support breaks, it often becomes new resistance and vice versa.",
        action: "On your next trade, place your entry and stop loss based on support/resistance",
      },
    ],
  },
  "lot-sizes": {
    title: "Lot Sizes",
    description: "Control your trade position size.",
    fullDescription:
      "Learn how lot sizes work and how to calculate the right position size for your account and risk tolerance.",
    steps: [
      {
        title: "What is a Lot?",
        description:
          "A lot represents 100,000 units of the base currency. A micro lot (0.01) is 1,000 units. A mini lot (0.1) is 10,000 units. You'll start with micro lots.",
        action: "Try placing a 0.01 lot trade to get familiar with micro lots",
        elementSelector: "[href='/trade']",
      },
      {
        title: "Lot Size and Pip Value",
        description:
          "With a 0.01 lot (micro lot), each pip movement is worth about $0.10. With 0.1 lot (mini lot), each pip is worth about $1.00. Larger lots = larger risk per pip.",
        action: "Calculate pip values for different lot sizes: 0.01 lot × $0.10/pip",
      },
      {
        title: "Calculating Position Size",
        description:
          "Formula: (Account Balance × Risk %) / (Stop Loss Distance in Pips) = Lot Size. Example: ($10,000 × 0.01) / 100 pips = 0.01 lot",
        action: "Use this formula to determine your lot size before trading",
      },
      {
        title: "Consistency is Key",
        description:
          "Keep your lot sizes consistent while you're learning. This helps you focus on strategy instead of being confused by different risk levels. Scale up slowly.",
        action: "Commit to trading 0.01 lots for your first 10 practice trades",
      },
    ],
  },
}

export default function LessonPage() {
  const { user, isLoading } = useUser()
  const router = useRouter()
  const params = useParams()
  const lessonId = params.lessonId as string

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [helpOpen, setHelpOpen] = useState(false)
  const [showTutorial, setShowTutorial] = useState(false)

  const lesson = lessonContent[lessonId]
  const { t } = useTranslate()
  const { saveProgress } = useLearning()

  const translatedLesson = lesson
    ? {
        title: t(`lesson.${lessonId}.title`) || lesson.title,
        description: t(`lesson.${lessonId}.description`) || lesson.description,
        fullDescription: t(`lesson.${lessonId}.fullDescription`) || lesson.fullDescription,
        steps: lesson.steps.map((s, i) => ({
          title: t(`lesson.${lessonId}.steps.${i}.title`) || s.title,
          description: t(`lesson.${lessonId}.steps.${i}.description`) || s.description,
          action: t(`lesson.${lessonId}.steps.${i}.action`) || s.action,
          elementSelector: s.elementSelector,
        })),
      }
    : null

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login")
    }
  }, [user, isLoading, router])

  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!lesson) {
    return (
      <div className="flex h-screen bg-background overflow-hidden font-sans">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          <Header
            onMenuClick={() => setSidebarOpen(true)}
            onHelpClick={() => setHelpOpen(true)}
            title={t("lesson-not-found-title")}
            subtitle={t("lesson-not-found-desc")}
          />
          <main className="flex-1 overflow-y-auto p-3 md:p-4">
            <button
              onClick={() => router.back()}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
            >
              {t("back-to-lessons")}
            </button>
          </main>
        </div>
        <HelpPanel open={helpOpen} onClose={() => setHelpOpen(false)} />
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden font-sans">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          <Header
            onMenuClick={() => setSidebarOpen(true)}
            onHelpClick={() => setHelpOpen(true)}
            title={translatedLesson?.title ?? t("lesson-not-found-title")}
            subtitle={t("lesson-guided-subtitle")}
          />

        <main className="flex-1 overflow-y-auto p-3 md:p-4">
          <div className="max-w-2xl space-y-6">
            <section className="rounded-2xl bg-card border border-border p-5">
              <h2 className="text-2xl font-semibold text-foreground mb-3">{translatedLesson?.title}</h2>
              <p className="text-muted-foreground">{translatedLesson?.fullDescription}</p>
            </section>

            <section className="rounded-2xl bg-card border border-border p-5">
              <h3 className="text-lg font-semibold text-foreground mb-4">{t("lesson-overview")}</h3>
              <div className="space-y-3">
                {translatedLesson?.steps.map((step, idx) => (
                  <div key={idx} className="flex gap-3 pb-3 border-b border-muted/40 last:border-b-0">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-semibold text-primary">
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{step.title}</p>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <div className="flex gap-3">
              <button
                onClick={() => router.back()}
                className="px-4 py-2 border border-muted/40 text-foreground hover:bg-muted/40 rounded-lg transition-colors font-medium"
              >
                {t("back-to-lessons")}
              </button>
              <button
                onClick={async () => {
                  // mark lesson as in-progress (10%) then store tutorial payload so dashboard can run the guided flow
                  try {
                    await saveProgress(lessonId, 10, false)
                  } catch (e) {
                    // ignore failures (best-effort)
                  }

                  try {
                    const payload = {
                      lessonId,
                      title: translatedLesson?.title ?? lesson.title,
                      description: translatedLesson?.description ?? lesson.description,
                      steps: translatedLesson?.steps ?? lesson.steps,
                    }
                    sessionStorage.setItem("guidedTutorial", JSON.stringify(payload))
                  } catch (e) {
                    // ignore
                  }

                  // use full navigation to ensure cross-page start
                  if (typeof window !== "undefined") {
                    window.location.assign("/")
                  } else {
                    router.push("/")
                  }
                }}
                className="px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg transition-colors font-medium"
              >
                {t("start-guided-tutorial")}
              </button>
            </div>
          </div>
        </main>
      </div>

      <HelpPanel open={helpOpen} onClose={() => setHelpOpen(false)} />

      {showTutorial && (
        <TutorialGuide
          title={translatedLesson?.title ?? lesson.title}
          description={translatedLesson?.description ?? lesson.description}
          steps={translatedLesson?.steps ?? lesson.steps}
          onComplete={async () => {
            setShowTutorial(false)
            try {
              await saveProgress(lessonId, 100, true)
            } catch (e) {
              // ignore
            }
            router.push("/learn")
          }}
          onBack={() => setShowTutorial(false)}
        />
      )}
    </div>
  )
}
