"use client"

import { useState } from "react"
import { BookOpen, ChevronDown, ChevronUp } from "lucide-react"

const terms = [
  {
    term: "Pip",
    def: "The smallest price move in a currency pair. For most pairs, 1 pip = 0.0001. Think of it like a cent for currency.",
  },
  {
    term: "Lot",
    def: "The unit of measurement for a trade. Standard = 100,000 units, Mini = 10,000, Micro = 1,000. Beginners usually trade micro lots.",
  },
  {
    term: "Spread",
    def: "The difference between the buy (ask) and sell (bid) price. This is how brokers earn money — like the airport exchange rate margin.",
  },
  {
    term: "Leverage",
    def: "Borrowing from your broker to control a larger position. 1:100 means $100 controls $10,000. It amplifies both gains AND losses.",
  },
  {
    term: "Margin",
    def: "The deposit needed to open a leveraged trade. If you use 1:100 leverage to trade $10,000, you only need $100 margin.",
  },
  {
    term: "Stop Loss",
    def: "An automatic order to close your trade if the price moves against you by a set amount. Always use one to protect your account.",
  },
  {
    term: "Take Profit",
    def: "An automatic order to close your trade once it reaches your profit target. Locks in gains without watching the screen.",
  },
  {
    term: "Bull / Bear",
    def: "Bull market = prices rising. Bear market = prices falling. Bulls charge upward, bears swipe downward — easy to remember.",
  },
]

export function GlossaryPanel() {
  const [expanded, setExpanded] = useState<string | null>(null)
  const [showAll, setShowAll] = useState(false)

  const visible = showAll ? terms : terms.slice(0, 4)

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 rounded-md bg-primary/15 flex items-center justify-center">
          <BookOpen className="w-3.5 h-3.5 text-primary" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-foreground">Forex Glossary</h2>
          <p className="text-xs text-muted-foreground">Tap a term to learn more</p>
        </div>
      </div>

      <div className="space-y-1">
        {visible.map(({ term, def }) => {
          const isOpen = expanded === term
          return (
            <div key={term} className="rounded-lg overflow-hidden border border-border/50">
              <button
                onClick={() => setExpanded(isOpen ? null : term)}
                className="w-full flex items-center justify-between px-3 py-2.5 text-left hover:bg-accent/40 transition-colors"
                aria-expanded={isOpen}
              >
                <span className="text-xs font-medium text-foreground">{term}</span>
                {isOpen
                  ? <ChevronUp className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                  : <ChevronDown className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                }
              </button>
              {isOpen && (
                <div className="px-3 pb-3">
                  <p className="text-xs text-muted-foreground leading-relaxed">{def}</p>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <button
        onClick={() => setShowAll(!showAll)}
        className="mt-3 w-full text-xs text-primary hover:text-primary/80 font-medium transition-colors py-1"
      >
        {showAll ? "Show fewer terms" : `Show ${terms.length - 4} more terms`}
      </button>
    </div>
  )
}
