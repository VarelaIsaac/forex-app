"use client"

import { ArrowDownRight, ArrowUpRight, HelpCircle, Landmark, TrendingUp, Wallet } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

interface StatsRowProps {
  showTutorialHighlight?: boolean
}

const stats = [
  {
    label: "Account Balance",
    hint: "Your total virtual funds including open position values. This is like your bank account for trading.",
    value: "$10,284.50",
    change: "+2.84%",
    positive: true,
    icon: Wallet,
    sub: "Started with $10,000",
    beginner: "This is your total money available for trading.",
  },
  {
    label: "Today's P&L",
    hint: "Profit & Loss — how much you've gained or lost today across all trades.",
    value: "+$142.30",
    change: "+1.41%",
    positive: true,
    icon: TrendingUp,
    sub: "3 trades today",
    beginner: "Green means you're making money today!",
  },
  {
    label: "Open Positions",
    hint: "Trades you currently have running. Each position uses some of your available margin.",
    value: "2",
    change: null,
    positive: null,
    icon: ArrowUpRight,
    sub: "EUR/USD, GBP/JPY",
    beginner: "You have 2 active trades right now.",
  },
  {
    label: "Available Margin",
    hint: "The portion of your balance you can still use to open new trades. Think of it as your 'buying power'.",
    value: "$8,920.00",
    change: null,
    positive: null,
    icon: Landmark,
    sub: "86.7% of balance",
    beginner: "How much you can still use for new trades.",
  },
]

export function StatsRow({ showTutorialHighlight }: StatsRowProps) {
  return (
    <TooltipProvider>
      <div 
        className={cn(
          "grid grid-cols-2 lg:grid-cols-4 gap-4 transition-all",
          showTutorialHighlight && "ring-2 ring-primary ring-offset-2 ring-offset-background rounded-xl"
        )}
      >
        {stats.map(({ label, hint, value, change, positive, icon: Icon, sub, beginner }) => (
          <div 
            key={label} 
            className="rounded-xl border border-border bg-card p-4 space-y-3 group hover:border-primary/30 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-medium text-muted-foreground leading-none">{label}</span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="text-muted-foreground/50 hover:text-primary transition-colors" aria-label={`What is ${label}?`}>
                      <HelpCircle className="w-3.5 h-3.5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-[220px]">
                    <p className="text-xs leading-relaxed">{hint}</p>
                    <p className="text-xs text-primary font-medium mt-1.5 border-t border-border pt-1.5">
                      {beginner}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
                <Icon className="w-4 h-4 text-primary" />
              </div>
            </div>

            <p className="text-2xl font-semibold text-foreground tabular-nums">{value}</p>

            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">{sub}</p>
              {change !== null && (
                <span
                  className={cn(
                    "flex items-center gap-0.5 text-xs font-medium px-1.5 py-0.5 rounded",
                    positive ? "text-profit bg-profit/10" : "text-loss bg-loss/10"
                  )}
                >
                  {positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {change}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </TooltipProvider>
  )
}
