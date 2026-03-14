"use client"

import { AlertCircle, CheckCircle2, Clock, HelpCircle, Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const trades = [
  {
    id: 1,
    pair: "EUR/USD",
    direction: "BUY",
    lots: 0.01,
    entry: 1.08290,
    current: 1.08420,
    pnl: +1.30,
    status: "open",
    opened: "09:32 AM",
  },
  {
    id: 2,
    pair: "GBP/JPY",
    direction: "BUY",
    lots: 0.01,
    entry: 186.420,
    current: 186.610,
    pnl: +0.95,
    status: "open",
    opened: "11:14 AM",
  },
  {
    id: 3,
    pair: "USD/JPY",
    direction: "SELL",
    lots: 0.01,
    entry: 149.920,
    current: 149.870,
    pnl: +0.50,
    status: "closed",
    opened: "Yesterday",
  },
  {
    id: 4,
    pair: "AUD/USD",
    direction: "BUY",
    lots: 0.01,
    entry: 0.65180,
    current: 0.65090,
    pnl: -0.90,
    status: "closed",
    opened: "Yesterday",
  },
]

const columnHints: Record<string, string> = {
  Pair: "The two currencies being exchanged. EUR/USD means trading Euros for US Dollars.",
  Direction: "BUY = you profit when price goes UP. SELL = you profit when price goes DOWN.",
  Size: "How much you're trading. 0.01 lots is the smallest — perfect for learning!",
  Entry: "The price when your trade started.",
  "P&L": "Profit & Loss — green means you're making money, red means losing.",
  Status: "Open = trade is still running. Closed = trade is finished.",
}

export function RecentTrades() {
  const openTrades = trades.filter((t) => t.status === "open")
  const hasOpenTrades = openTrades.length > 0

  return (
    <TooltipProvider>
      <div className="rounded-xl border border-border bg-card p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              Your Trades
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Hover headers to learn what they mean
            </p>
          </div>
          <div className="flex items-center gap-2">
            {hasOpenTrades && (
              <Badge variant="secondary" className="text-xs bg-warning/15 text-warning border-0">
                {openTrades.length} active
              </Badge>
            )}
          </div>
        </div>

        {/* Empty state for no trades */}
        {trades.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
              <Info className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-foreground">No trades yet</p>
            <p className="text-xs text-muted-foreground mt-1">
              Place your first practice trade to see it here
            </p>
          </div>
        ) : (
          <>
            {/* Table */}
            <div className="overflow-x-auto -mx-1">
              <table className="w-full text-xs min-w-[560px]">
                <thead>
                  <tr className="border-b border-border">
                    {["Pair", "Direction", "Size", "Entry", "P&L", "Status"].map((col) => (
                      <th key={col} className="text-left pb-3 px-2 font-medium text-muted-foreground">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="flex items-center gap-1.5 cursor-help w-fit hover:text-primary transition-colors">
                              {col}
                              <HelpCircle className="w-3 h-3 text-muted-foreground/40" />
                            </span>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="max-w-[200px]">
                            <p className="text-xs leading-relaxed">{columnHints[col]}</p>
                          </TooltipContent>
                        </Tooltip>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {trades.map((trade) => (
                    <tr
                      key={trade.id}
                      className={cn(
                        "border-b border-border/50 last:border-0 transition-colors",
                        trade.status === "open" 
                          ? "bg-warning/3 hover:bg-warning/5" 
                          : "hover:bg-accent/30"
                      )}
                    >
                      <td className="py-3.5 px-2">
                        <span className="font-semibold text-foreground">{trade.pair}</span>
                      </td>
                      <td className="py-3.5 px-2">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span
                              className={cn(
                                "inline-flex px-2 py-1 rounded text-[10px] font-bold cursor-help",
                                trade.direction === "BUY"
                                  ? "bg-profit/15 text-profit"
                                  : "bg-loss/15 text-loss"
                              )}
                            >
                              {trade.direction}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent side="top">
                            <p className="text-xs">
                              {trade.direction === "BUY" 
                                ? "You profit if the price goes UP" 
                                : "You profit if the price goes DOWN"}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </td>
                      <td className="py-3.5 px-2 text-foreground tabular-nums">{trade.lots} lots</td>
                      <td className="py-3.5 px-2 text-foreground tabular-nums">
                        {trade.entry.toFixed(trade.pair.includes("JPY") ? 3 : 5)}
                      </td>
                      <td className="py-3.5 px-2">
                        <span
                          className={cn(
                            "font-semibold tabular-nums",
                            trade.pnl >= 0 ? "text-profit" : "text-loss"
                          )}
                        >
                          {trade.pnl >= 0 ? "+" : ""}${trade.pnl.toFixed(2)}
                        </span>
                      </td>
                      <td className="py-3.5 px-2">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1.5 text-[10px] font-semibold px-2 py-1 rounded",
                            trade.status === "open" 
                              ? "bg-warning/15 text-warning" 
                              : "bg-muted text-muted-foreground"
                          )}
                        >
                          {trade.status === "open" ? (
                            <>
                              <span className="w-1.5 h-1.5 rounded-full bg-warning animate-pulse" />
                              Active
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="w-3 h-3" />
                              Closed
                            </>
                          )}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Learning note */}
            <div className="mt-4 flex items-start gap-3 bg-primary/5 border border-primary/15 rounded-lg px-4 py-3">
              <AlertCircle className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <div className="space-y-1">
                <p className="text-xs font-medium text-foreground">Understanding P&L (Profit & Loss)</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  P&L shows how much you{"'"}ve gained or lost on each trade. 
                  It{"'"}s calculated from the difference between your entry price and current price, 
                  multiplied by your trade size. With 0.01 lots, each pip is worth about $0.10.
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </TooltipProvider>
  )
}
