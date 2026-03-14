"use client"

import { useState } from "react"
import { AlertTriangle, CheckCircle2, HelpCircle, Info, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

interface QuickTradeProps {
  showTutorialHighlight?: boolean
}

const pairs = ["EUR/USD", "GBP/USD", "USD/JPY", "AUD/USD"]

function HintIcon({ text }: { text: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button className="text-muted-foreground/50 hover:text-primary transition-colors ml-1" aria-label="More info">
          <HelpCircle className="w-3.5 h-3.5" />
        </button>
      </TooltipTrigger>
      <TooltipContent side="right" className="max-w-55 text-xs leading-relaxed">
        {text}
      </TooltipContent>
    </Tooltip>
  )
}

export function QuickTrade({ showTutorialHighlight }: QuickTradeProps) {
  const [pair, setPair] = useState("EUR/USD")
  const [amount, setAmount] = useState("0.01")
  const [submitted, setSubmitted] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [pendingDirection, setPendingDirection] = useState<"buy" | "sell" | null>(null)

  const bid = 1.08390
  const ask = 1.08412
  const spread = ((ask - bid) * 10000).toFixed(1)

  function handleTradeClick(direction: "buy" | "sell") {
    setPendingDirection(direction)
    setShowConfirm(true)
  }

  function confirmTrade() {
    setSubmitted(true)
    setShowConfirm(false)
    setPendingDirection(null)
    setTimeout(() => setSubmitted(false), 4000)
  }

  function cancelTrade() {
    setShowConfirm(false)
    setPendingDirection(null)
  }

  return (
    <TooltipProvider>
      <div 
        className={cn(
          "rounded-xl border border-border bg-card p-5 space-y-4 transition-all",
          showTutorialHighlight && "ring-2 ring-primary ring-offset-2 ring-offset-background"
        )}
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-sm font-semibold text-foreground">Place a Trade</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Practice with virtual money</p>
          </div>
          <div className="flex items-center gap-1 bg-warning/10 border border-warning/25 rounded-full px-2 py-0.5">
            <Shield className="w-3 h-3 text-warning" />
            <span className="text-[10px] font-medium text-warning">Safe Mode</span>
          </div>
        </div>

        {/* Success message */}
        {submitted && (
          <div className="rounded-lg bg-profit/10 border border-profit/25 px-4 py-3 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-profit shrink-0" />
            <div>
              <p className="text-sm font-medium text-profit">Trade placed successfully!</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                This is a practice trade — no real money was used.
              </p>
            </div>
          </div>
        )}

        {/* Confirmation dialog */}
        {showConfirm && (
          <div className="rounded-lg border-2 border-warning/50 bg-warning/5 p-4 space-y-3">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-foreground">Confirm your trade</p>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  You{"'"}re about to <span className={cn("font-medium", pendingDirection === "buy" ? "text-profit" : "text-loss")}>
                    {pendingDirection?.toUpperCase()}
                  </span> {amount} lots of {pair}.
                  This is practice mode — no real money involved.
                </p>
              </div>
            </div>
            <div className="flex gap-2 pl-8">
              <Button
                size="sm"
                variant="outline"
                onClick={cancelTrade}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={confirmTrade}
                className={cn(
                  "text-xs",
                  pendingDirection === "buy" 
                    ? "bg-profit hover:bg-profit/90" 
                    : "bg-loss hover:bg-loss/90"
                )}
              >
                Confirm {pendingDirection?.toUpperCase()}
              </Button>
            </div>
          </div>
        )}

        {/* Pair selector */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground flex items-center">
            Currency Pair
            <HintIcon text="Select which two currencies you want to trade. EUR/USD means buying Euros with US Dollars (or vice versa)." />
          </label>
          <select
            aria-label="Currency pair"
            value={pair}
            onChange={(e) => setPair(e.target.value)}
            className="w-full bg-muted border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {pairs.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>

        {/* Bid / Ask prices */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground flex items-center">
            Current Prices
            <HintIcon text="The Sell price (Bid) is what you get when selling. The Buy price (Ask) is what you pay when buying. The difference is the spread." />
          </label>
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-lg bg-loss/8 border border-loss/20 p-3 text-center">
              <p className="text-[10px] text-loss font-semibold uppercase tracking-wider">Sell Price</p>
              <p className="text-lg font-bold tabular-nums text-foreground mt-1">{bid.toFixed(5)}</p>
            </div>
            <div className="rounded-lg bg-profit/8 border border-profit/20 p-3 text-center">
              <p className="text-[10px] text-profit font-semibold uppercase tracking-wider">Buy Price</p>
              <p className="text-lg font-bold tabular-nums text-foreground mt-1">{ask.toFixed(5)}</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Spread: <span className="text-foreground font-medium">{spread} pips</span>
            <HintIcon text="The spread is the broker's fee. Lower spreads mean lower trading costs. Major pairs like EUR/USD typically have the lowest spreads." />
          </p>
        </div>

        {/* Amount */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground flex items-center">
            Trade Size (Lots)
            <HintIcon text="Lot size = how much you're trading. 0.01 = micro lot (safest for learning), 0.1 = mini lot, 1.0 = standard lot. Start with 0.01!" />
          </label>
          <input
            aria-label="Trade size in lots"
            type="number"
            value={amount}
            min="0.01"
            step="0.01"
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-muted border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring tabular-nums"
          />
          
          {/* Quick select buttons */}
          <div className="flex gap-1.5">
            {["0.01", "0.05", "0.1", "0.5"].map((v) => (
              <button
                key={v}
                onClick={() => setAmount(v)}
                className={cn(
                  "flex-1 rounded-lg py-2 text-xs font-medium transition-colors",
                  amount === v 
                    ? "bg-primary/20 text-primary border border-primary/30" 
                    : "bg-muted text-muted-foreground hover:text-foreground hover:bg-accent border border-transparent"
                )}
              >
                {v}
              </button>
            ))}
          </div>

          {/* Beginner recommendation */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 rounded-lg px-3 py-2">
            <Info className="w-3.5 h-3.5 text-primary shrink-0" />
            <span>
              <span className="text-primary font-medium">Recommended:</span> Start with 0.01 lots while learning.
            </span>
          </div>
        </div>

        {/* Buy / Sell buttons */}
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={() => handleTradeClick("sell")}
              disabled={showConfirm || submitted}
              variant="outline"
              className="h-12 border-loss/40 text-loss hover:bg-loss/10 hover:border-loss hover:text-loss font-bold text-sm"
            >
              <span className="flex flex-col items-center">
                <span>SELL</span>
                <span className="text-[10px] font-normal opacity-70">Profit if price falls</span>
              </span>
            </Button>
            <Button
              onClick={() => handleTradeClick("buy")}
              disabled={showConfirm || submitted}
              className="h-12 bg-profit hover:bg-profit/90 text-foreground font-bold text-sm"
            >
              <span className="flex flex-col items-center">
                <span>BUY</span>
                <span className="text-[10px] font-normal opacity-70">Profit if price rises</span>
              </span>
            </Button>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
