"use client"

import { useState } from "react"
import { 
  BookOpen, 
  ChevronRight, 
  ExternalLink, 
  HelpCircle, 
  Lightbulb, 
  MessageCircle, 
  Search, 
  TrendingUp, 
  X,
  Zap
} from "lucide-react"
import { cn } from "@/lib/utils"

const categories = [
  {
    id: "getting-started",
    label: "Getting Started",
    icon: Zap,
    articles: [
      { title: "What is forex trading?", time: "3 min read" },
      { title: "Understanding currency pairs", time: "4 min read" },
      { title: "How to read a price chart", time: "5 min read" },
      { title: "Your first practice trade", time: "3 min read" },
    ],
  },
  {
    id: "trading-basics",
    label: "Trading Basics",
    icon: TrendingUp,
    articles: [
      { title: "What are pips and lots?", time: "3 min read" },
      { title: "Understanding leverage and margin", time: "5 min read" },
      { title: "Setting stop-loss and take-profit", time: "4 min read" },
      { title: "Market vs limit orders", time: "3 min read" },
    ],
  },
  {
    id: "strategies",
    label: "Simple Strategies",
    icon: Lightbulb,
    articles: [
      { title: "Trend following for beginners", time: "6 min read" },
      { title: "Support and resistance basics", time: "5 min read" },
      { title: "Risk management 101", time: "4 min read" },
    ],
  },
]

const faqs = [
  {
    q: "Is this real money?",
    a: "No! You're in practice mode with $10,000 virtual money. Nothing you do here costs real money.",
  },
  {
    q: "What does BUY and SELL mean?",
    a: "BUY (going 'long') means you profit when the price goes UP. SELL (going 'short') means you profit when the price goes DOWN.",
  },
  {
    q: "What's a safe lot size to start?",
    a: "Start with 0.01 lots (micro lot). This minimizes your risk while you learn how trading works.",
  },
  {
    q: "What is spread?",
    a: "The spread is the difference between the buy and sell price. It's essentially the broker's fee for each trade.",
  },
]

interface HelpPanelProps {
  open: boolean
  onClose: () => void
}

export function HelpPanel({ open, onClose }: HelpPanelProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

  if (!open) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <aside className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-card border-l border-border shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/15 flex items-center justify-center">
              <HelpCircle className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-foreground">Help Center</h2>
              <p className="text-xs text-muted-foreground">Learn forex trading step by step</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            aria-label="Close help panel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search */}
        <div className="px-5 py-3 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search help articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-muted border border-border rounded-lg pl-9 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Quick FAQ */}
          <div className="px-5 py-4 border-b border-border">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Frequently Asked
            </h3>
            <div className="space-y-2">
              {faqs.map((faq, i) => (
                <div key={i} className="rounded-lg border border-border overflow-hidden">
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                    className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-accent/50 transition-colors"
                  >
                    <span className="text-sm font-medium text-foreground">{faq.q}</span>
                    <ChevronRight
                      className={cn(
                        "w-4 h-4 text-muted-foreground transition-transform",
                        expandedFaq === i && "rotate-90"
                      )}
                    />
                  </button>
                  {expandedFaq === i && (
                    <div className="px-4 pb-3">
                      <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div className="px-5 py-4">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Learning Guides
            </h3>
            <div className="space-y-2">
              {categories.map((cat) => {
                const Icon = cat.icon
                const isExpanded = activeCategory === cat.id

                return (
                  <div key={cat.id} className="rounded-lg border border-border overflow-hidden">
                    <button
                      onClick={() => setActiveCategory(isExpanded ? null : cat.id)}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-accent/50 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="text-sm font-medium text-foreground">{cat.label}</p>
                        <p className="text-xs text-muted-foreground">{cat.articles.length} articles</p>
                      </div>
                      <ChevronRight
                        className={cn(
                          "w-4 h-4 text-muted-foreground transition-transform",
                          isExpanded && "rotate-90"
                        )}
                      />
                    </button>
                    {isExpanded && (
                      <div className="px-4 pb-3 space-y-1">
                        {cat.articles.map((article, i) => (
                          <button
                            key={i}
                            className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-left hover:bg-accent transition-colors group"
                          >
                            <span className="text-sm text-foreground group-hover:text-primary transition-colors">
                              {article.title}
                            </span>
                            <span className="text-xs text-muted-foreground">{article.time}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-border space-y-3">
          <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
            <MessageCircle className="w-4 h-4" />
            Chat with Support
          </button>
          <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
            <ExternalLink className="w-4 h-4" />
            View Full Documentation
          </button>
        </div>
      </aside>
    </>
  )
}
