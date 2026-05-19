"use client"

import { ArrowDownRight, ArrowUpRight, HelpCircle, Landmark, TrendingUp, Wallet } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useTrades } from "@/contexts/trades-context"
import { cn } from "@/lib/utils"

interface StatsRowProps {
  showTutorialHighlight?: boolean
}

export function StatsRow({ showTutorialHighlight }: StatsRowProps) {
  const { trades, balance, initialBalance, getTotalProfit } = useTrades()
  
  const totalProfit = getTotalProfit()
  const profitPercentage = ((totalProfit / initialBalance) * 100).toFixed(2)
  const openPositions = trades.filter((t) => t.status === "open").length
  const openTradesPairs = trades
    .filter((t) => t.status === "open")
    .map((t) => t.pair)
    .join(", ") || "Ninguna"
  
  const margin = balance
  const marginPercentage = ((margin / initialBalance) * 100).toFixed(1)

  const stats = [
    {
      label: "Saldo de la cuenta",
      hint: "Tus fondos virtuales totales, incluyendo el valor de las posiciones abiertas. Es como tu cuenta bancaria para operar.",
      value: `$${balance.toFixed(2)}`,
      change: profitPercentage,
      positive: totalProfit >= 0,
      icon: Wallet,
      sub: `Empezaste con $${initialBalance.toFixed(2)}`,
      beginner: "Este es tu dinero total disponible para operar.",
    },
    {
      label: "P&G de hoy",
      hint: "Ganancias y pérdidas: cuánto has ganado o perdido hoy en todas tus operaciones.",
      value: `${totalProfit >= 0 ? "+" : ""}$${totalProfit.toFixed(2)}`,
      change: `${profitPercentage}%`,
      positive: totalProfit >= 0,
      icon: TrendingUp,
      sub: `${trades.length} operaciones en total`,
      beginner: totalProfit >= 0 ? "El verde significa que estás ganando dinero." : "Las pérdidas muestran qué debes mejorar.",
    },
    {
      label: "Posiciones abiertas",
      hint: "Operaciones que tienes activas ahora mismo. Cada posición usa parte de tu margen disponible.",
      value: openPositions.toString(),
      change: null,
      positive: null,
      icon: ArrowUpRight,
      sub: openTradesPairs,
      beginner: `Tienes ${openPositions} operación${openPositions !== 1 ? "es" : ""} activa${openPositions !== 1 ? "s" : ""} ahora mismo.`,
    },
    {
      label: "Margen disponible",
      hint: "La parte de tu saldo que aún puedes usar para abrir nuevas operaciones. Piensa en ello como tu poder de compra.",
      value: `$${margin.toFixed(2)}`,
      change: null,
      positive: null,
      icon: Landmark,
      sub: `${marginPercentage}% del saldo`,
      beginner: "Cuánto te queda disponible para nuevas operaciones.",
    },
  ]

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
                    <button className="text-muted-foreground/50 hover:text-primary transition-colors" aria-label={`¿Qué es ${label}?`}>
                      <HelpCircle className="w-3.5 h-3.5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-55">
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
              <p className="text-xs text-muted-foreground truncate">{sub}</p>
              {change !== null && (
                <span
                  className={cn(
                    "flex items-center gap-0.5 text-xs font-medium px-1.5 py-0.5 rounded shrink-0",
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
