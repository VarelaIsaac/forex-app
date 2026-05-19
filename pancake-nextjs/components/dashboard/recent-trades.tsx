"use client"

import { AlertCircle, CheckCircle2, Clock, HelpCircle, Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { useTrades } from "@/contexts/trades-context"
import { useTranslate } from "@/hooks/use-translate"
import { cn } from "@/lib/utils"

export function RecentTrades() {
  const { trades } = useTrades()
  const { t } = useTranslate()

  const columnLabels = [
    { key: "pair", label: t("trades-column-pair") },
    { key: "direction", label: t("trades-column-direction") },
    { key: "size", label: t("trades-column-size") },
    { key: "entry", label: t("trades-column-entry") },
    { key: "pnl", label: t("trades-column-pnl") },
    { key: "status", label: t("trades-column-status") },
  ]

  const columnHints: Record<string, string> = {
    [t("trades-column-pair")]: t("trades-hint-pair"),
    [t("trades-column-direction")]: t("trades-hint-direction"),
    [t("trades-column-size")]: t("trades-hint-size"),
    [t("trades-column-entry")]: t("trades-hint-entry"),
    [t("trades-column-pnl")]: t("trades-hint-pnl"),
    [t("trades-column-status")]: t("trades-hint-status"),
  }
  
  const sortedTrades = [...trades].reverse().slice(0, 10)
  const openTrades = sortedTrades.filter((t) => t.status === "open")
  const hasOpenTrades = openTrades.length > 0

  return (
    <TooltipProvider>
      <div className="rounded-xl border border-border bg-card p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              {t("your-trades")}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {t("trades-hover-headers")}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {hasOpenTrades && (
              <Badge variant="secondary" className="text-xs bg-warning/15 text-warning border-0">
                {openTrades.length} {t("trades-active")}
              </Badge>
            )}
          </div>
        </div>

        {/* Empty state for no trades */}
        {sortedTrades.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
              <Info className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-foreground">{t("trades-empty-title")}</p>
            <p className="text-xs text-muted-foreground mt-1">{t("trades-empty-desc")}</p>
          </div>
        ) : (
          <>
            {/* Table */}
            <div className="overflow-x-auto -mx-1">
              <table className="w-full text-xs min-w-140">
                <thead>
                  <tr className="border-b border-border">
                    {columnLabels.map((col) => (
                      <th key={col.key} className="text-left pb-3 px-2 font-medium text-muted-foreground">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="flex items-center gap-1.5 cursor-help w-fit hover:text-primary transition-colors">
                              {col.label}
                              <HelpCircle className="w-3 h-3 text-muted-foreground/40" />
                            </span>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="max-w-50">
                            <p className="text-xs leading-relaxed">{columnHints[col.label]}</p>
                          </TooltipContent>
                        </Tooltip>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sortedTrades.map((trade) => {
                    const currentPrice = trade.direction === "buy" ? 1.08420 : 1.08390
                    const pnl = trade.status === "closed" 
                      ? trade.profitLoss ?? 0
                      : (trade.direction === "buy" 
                          ? (currentPrice - trade.entryPrice) * trade.size * 10000
                          : (trade.entryPrice - currentPrice) * trade.size * 10000)
                    
                    return (
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
                                  trade.direction === "buy"
                                    ? "bg-profit/15 text-profit"
                                    : "bg-loss/15 text-loss"
                                )}
                              >
                                {trade.direction.toUpperCase()}
                              </span>
                            </TooltipTrigger>
                            <TooltipContent side="top">
                              <p className="text-xs">
                                {trade.direction === "buy"
                                  ? t("trades-direction-buy-hint")
                                  : t("trades-direction-sell-hint")}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </td>
                        <td className="py-3.5 px-2 text-foreground tabular-nums">{trade.size} {t("trades-lots")}</td>
                        <td className="py-3.5 px-2 text-foreground tabular-nums">
                          {trade.entryPrice.toFixed(trade.pair.includes("JPY") ? 3 : 5)}
                        </td>
                        <td className="py-3.5 px-2">
                          <span
                            className={cn(
                              "font-semibold tabular-nums",
                              pnl >= 0 ? "text-profit" : "text-loss"
                            )}
                          >
                            {pnl >= 0 ? "+" : ""}${pnl.toFixed(2)}
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
                                {t("trades-status-open")}
                              </>
                            ) : (
                              <>
                                <CheckCircle2 className="w-3 h-3" />
                                {t("trades-status-closed")}
                              </>
                            )}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Learning note */}
            <div className="mt-4 flex items-start gap-3 bg-primary/5 border border-primary/15 rounded-lg px-4 py-3">
              <AlertCircle className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <div className="space-y-1">
                <p className="text-xs font-medium text-foreground">{t("trades-pnl-title")}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{t("trades-pnl-desc")}</p>
              </div>
            </div>
          </>
        )}
      </div>
    </TooltipProvider>
  )
}

