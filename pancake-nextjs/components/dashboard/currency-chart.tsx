"use client"

import { useState, useEffect } from "react"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip, XAxis, YAxis } from "recharts"
import { HelpCircle, Info, TrendingDown, TrendingUp } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

interface CurrencyChartProps {
  showTutorialHighlight?: boolean
}

const pairs = ["EUR/USD", "GBP/USD", "USD/JPY", "AUD/USD"]
const timeframes = ["1H", "4H", "1D", "1W"]

const timeframeConfig: Record<string, { points: number; labelFn: (i: number) => string }> = {
  "1H": { points: 60,  labelFn: (i) => `${i}m` },
  "4H": { points: 48,  labelFn: (i) => `${i * 5}m` },
  "1D": { points: 24,  labelFn: (i) => `${String(i).padStart(2, "0")}:00` },
  "1W": { points: 28,  labelFn: (i) => `D${Math.floor(i / 4) + 1}` },
}

function generateData(seed: number, base: number, points: number, labelFn: (i: number) => string) {
  const data = []
  let value = base
  for (let i = 0; i < points; i++) {
    value += (Math.sin(i * 0.4 + seed) * 0.0008 + (Math.random() - 0.49) * 0.0012)
    data.push({ time: labelFn(i), price: parseFloat(value.toFixed(5)) })
  }
  return data
}

const pairSeeds: Record<string, [number, number]> = {
  "EUR/USD": [1, 1.0842],
  "GBP/USD": [2, 1.2635],
  "USD/JPY": [3, 149.82],
  "AUD/USD": [4, 0.6521],
}

const pairInfo: Record<string, { base: string; quote: string; desc: string; difficulty: string }> = {
  "EUR/USD": { base: "EUR", quote: "USD", desc: "Euro vs US Dollar â€” the world's most traded pair.", difficulty: "Beginner friendly" },
  "GBP/USD": { base: "GBP", quote: "USD", desc: "British Pound vs US Dollar, often called 'Cable'.", difficulty: "Beginner friendly" },
  "USD/JPY": { base: "USD", quote: "JPY", desc: "US Dollar vs Japanese Yen â€” popular in Asian markets.", difficulty: "Intermediate" },
  "AUD/USD": { base: "AUD", quote: "USD", desc: "Australian Dollar vs US Dollar, influenced by commodities.", difficulty: "Intermediate" },
}

export function CurrencyChart({ showTutorialHighlight }: CurrencyChartProps) {
  const [activePair, setActivePair] = useState("EUR/USD")
  const [activeTimeframe, setActiveTimeframe] = useState("1D")
  const [chartDataMap, setChartDataMap] = useState<Record<string, { time: string; price: number }[]> | null>(null)

  // Client-only generation to avoid SSR/hydration mismatch (Math.random)
  useEffect(() => {
    const { points, labelFn } = timeframeConfig[activeTimeframe]
    const map: Record<string, { time: string; price: number }[]> = {}
    for (const [pair, [seed, base]] of Object.entries(pairSeeds)) {
      map[pair] = generateData(seed, base, points, labelFn)
    }
    setChartDataMap(map)
  }, [activeTimeframe])

  const info = pairInfo[activePair]

  if (!chartDataMap) {
    return (
      <div className="rounded-xl border border-border bg-card p-5 space-y-4">
        <div className="flex flex-wrap gap-1.5">
          {pairs.map((p) => (
            <button key={p} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-muted text-muted-foreground">{p}</button>
          ))}
        </div>
        <div className="h-56 flex items-center justify-center">
          <span className="text-muted-foreground text-sm">Loading chart...</span>
        </div>
      </div>
    )
  }

  const data = chartDataMap[activePair]
  const first = data[0].price
  const last = data[data.length - 1].price
  const change = last - first
  const changePct = ((change / first) * 100).toFixed(2)
  const isUp = change >= 0
  const lineColor = isUp ? "#4ade80" : "#f87171"
  const gradientId = "chartGradient"

  return (
    <TooltipProvider>
      <div
        className={cn(
          "rounded-xl border border-border bg-card p-5 space-y-4 transition-all",
          showTutorialHighlight && "ring-2 ring-primary ring-offset-2 ring-offset-background"
        )}
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="space-y-3">
            {/* Pair selector */}
            <div className="flex flex-wrap gap-1.5">
              {pairs.map((p) => (
                <Tooltip key={p}>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => setActivePair(p)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                        activePair === p
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:text-foreground hover:bg-accent"
                      )}
                    >
                      {p}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p className="text-xs">{pairInfo[p].desc}</p>
                    <p className="text-xs text-primary mt-1">{pairInfo[p].difficulty}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>

            {/* Description with help */}
            <div className="flex items-start gap-2">
              <p className="text-xs text-muted-foreground leading-relaxed">{info.desc}</p>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button aria-label={`What is ${activePair}?`} className="text-muted-foreground/50 hover:text-primary transition-colors shrink-0">
                    <HelpCircle className="w-3.5 h-3.5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right" className="max-w-50">
                  <p className="text-xs">
                    <span className="font-medium">{info.base}</span> is the base currency.
                    The price shows how many <span className="font-medium">{info.quote}</span> you need to buy 1 {info.base}.
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>

          {/* Price display */}
          <div className="flex flex-col items-start sm:items-end gap-1 shrink-0">
            <p className="text-3xl font-semibold tabular-nums text-foreground">
              {last.toFixed(activePair === "USD/JPY" ? 3 : 5)}
            </p>
            <span
              className={cn(
                "flex items-center gap-1 text-sm font-medium px-2 py-0.5 rounded",
                isUp ? "text-profit bg-profit/10" : "text-loss bg-loss/10"
              )}
            >
              {isUp ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {isUp ? "+" : ""}{change.toFixed(5)} ({isUp ? "+" : ""}{changePct}%)
            </span>
          </div>
        </div>

        {/* Timeframe selector + legend */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
            {timeframes.map((tf) => (
              <Tooltip key={tf}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => setActiveTimeframe(tf)}
                    className={cn(
                      "px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
                      activeTimeframe === tf
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {tf}
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p className="text-xs">
                    {tf === "1H" && "Each point = 1 hour of price movement"}
                    {tf === "4H" && "Each point = 4 hours of price movement"}
                    {tf === "1D" && "Each point = 1 day of price movement"}
                    {tf === "1W" && "Each point = 1 week of price movement"}
                  </p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>

          {/* Visual legend */}
          <div className="hidden sm:flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-profit rounded-full" />
              Price going up
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-loss rounded-full" />
              Price going down
            </span>
          </div>
        </div>

        {/* Chart */}
        <div className="h-56 relative">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={lineColor} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={lineColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis
                dataKey="time"
                tick={{ fontSize: 10, fill: "#6b7280" }}
                tickLine={false}
                axisLine={false}
                interval={Math.floor(data.length / 6)}
              />
              <YAxis
                domain={["auto", "auto"]}
                tick={{ fontSize: 10, fill: "#6b7280" }}
                tickLine={false}
                axisLine={false}
                width={60}
                tickFormatter={(v) => v.toFixed(activePair === "USD/JPY" ? 2 : 4)}
              />
              <RechartsTooltip
                contentStyle={{
                  background: "#1c1f2e",
                  border: "1px solid #2e3347",
                  borderRadius: "8px",
                  fontSize: "12px",
                  color: "#e2e8f0",
                }}
                formatter={(value: number) => [value.toFixed(activePair === "USD/JPY" ? 3 : 5), "Price"]}
                labelFormatter={(l) => `Time: ${l}`}
              />
              <Area
                type="monotone"
                dataKey="price"
                stroke={lineColor}
                strokeWidth={2}
                fill={`url(#${gradientId})`}
                dot={false}
                activeDot={{ r: 5, strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Beginner tip */}
        <div className="flex items-start gap-3 bg-primary/5 border border-primary/15 rounded-lg px-4 py-3">
          <Info className="w-4 h-4 text-primary mt-0.5 shrink-0" />
          <p className="text-xs text-foreground/80 leading-relaxed">
            <span className="font-medium text-primary">Chart tip:</span> If the line goes{" "}
            <span className="text-profit font-medium">up</span>, buyers are stronger than sellers.
            If it goes <span className="text-loss font-medium">down</span>, sellers are winning.
            Watch for patterns over time!
          </p>
        </div>
      </div>
    </TooltipProvider>
  )
}
