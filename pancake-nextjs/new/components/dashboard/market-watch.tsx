"use client"

import { ArrowDownRight, ArrowUpRight, HelpCircle, TrendingUp } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

const pairs = [
  { pair: "EUR/USD", bid: 1.08390, ask: 1.08412, change: +0.32, label: "Euro / Dollar", hint: "Most traded pair — great for beginners" },
  { pair: "GBP/USD", bid: 1.26340, ask: 1.26368, change: -0.18, label: "Pound / Dollar", hint: "Also called 'Cable' — popular and liquid" },
  { pair: "USD/JPY", bid: 149.820, ask: 149.847, change: +0.11, label: "Dollar / Yen", hint: "Active during Asian market hours" },
  { pair: "AUD/USD", bid: 0.65180, ask: 0.65202, change: -0.42, label: "Aussie / Dollar", hint: "Influenced by commodity prices" },
]

export function MarketWatch() {
  return (
    <TooltipProvider>
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            <div>
              <h2 className="text-sm font-semibold text-foreground">Market Watch</h2>
              <p className="text-xs text-muted-foreground">Live prices</p>
            </div>
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="text-muted-foreground/50 hover:text-primary transition-colors">
                <HelpCircle className="w-4 h-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="left" className="max-w-[200px]">
              <p className="text-xs">Live prices for popular currency pairs. Click any pair to trade it.</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <div className="space-y-1.5">
          {pairs.map(({ pair, bid, ask, change, label, hint }) => {
            const isUp = change >= 0
            const decimals = pair.includes("JPY") ? 3 : 5
            const spread = ((ask - bid) * (pair.includes("JPY") ? 100 : 10000)).toFixed(1)
            
            return (
              <Tooltip key={pair}>
                <TooltipTrigger asChild>
                  <button className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg bg-muted/40 hover:bg-accent transition-colors group">
                    <div className="text-left">
                      <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{pair}</p>
                      <p className="text-[10px] text-muted-foreground">{label}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-sm font-medium tabular-nums text-foreground">{ask.toFixed(decimals)}</p>
                        <p className="text-[10px] text-muted-foreground">{spread}p spread</p>
                      </div>
                      <span
                        className={cn(
                          "flex items-center gap-0.5 text-xs font-medium tabular-nums px-1.5 py-0.5 rounded",
                          isUp ? "text-profit bg-profit/10" : "text-loss bg-loss/10"
                        )}
                      >
                        {isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        {isUp ? "+" : ""}{change.toFixed(2)}%
                      </span>
                    </div>
                  </button>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <p className="text-xs font-medium">{hint}</p>
                  <p className="text-xs text-muted-foreground mt-1">Click to trade this pair</p>
                </TooltipContent>
              </Tooltip>
            )
          })}
        </div>

        <p className="text-[10px] text-muted-foreground text-center mt-3">
          Prices update in real-time during market hours
        </p>
      </div>
    </TooltipProvider>
  )
}
