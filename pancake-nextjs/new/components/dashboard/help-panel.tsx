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
import { useTranslate } from "@/hooks/use-translate"

const categories = [
  { id: "getting-started", labelKey: "getting-started", icon: Zap, articleKey: "help.article.getting-started" },
  { id: "trading-basics", labelKey: "trading-basics", icon: TrendingUp, articleKey: "help.article.trading-basics" },
  { id: "strategies", labelKey: "simple-strategies", icon: Lightbulb, articleKey: "help.article.strategies" },
]

const faqs = [0, 1, 2, 3]

function catArticleCount(t: (k: string) => string, baseKey: string) {
  let count = 0
  for (let i = 0; i < 8; i++) {
    if (t(`${baseKey}.${i}.title`)) count++
    else break
  }
  return count
}

interface HelpPanelProps {
  open: boolean
  onClose: () => void
}

export function HelpPanel({ open, onClose }: HelpPanelProps) {
  const { t } = useTranslate()
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
              {t("faq-title")}
            </h3>
            <div className="space-y-2">
              {faqs.map((_, i) => (
                <div key={i} className="rounded-lg border border-border overflow-hidden">
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                    className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-accent/50 transition-colors"
                  >
                    <span className="text-sm font-medium text-foreground">{t(`faq.q.${i}`)}</span>
                    <ChevronRight
                      className={cn(
                        "w-4 h-4 text-muted-foreground transition-transform",
                        expandedFaq === i && "rotate-90"
                      )}
                    />
                  </button>
                  {expandedFaq === i && (
                    <div className="px-4 pb-3">
                      <p className="text-sm text-muted-foreground leading-relaxed">{t(`faq.a.${i}`)}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div className="px-5 py-4">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              {t("learning-guides")}
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
                        <p className="text-sm font-medium text-foreground">{t(cat.labelKey)}</p>
                        <p className="text-xs text-muted-foreground">{catArticleCount(t, cat.articleKey)} {t("articles-label")}</p>
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
                        {[0, 1, 2, 3].map((i) => {
                          const title = t(`${cat.articleKey}.${i}.title`)
                          const time = t(`${cat.articleKey}.${i}.time`)
                          if (!title) return null
                          return (
                            <button
                              key={i}
                              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-left hover:bg-accent transition-colors group"
                            >
                              <span className="text-sm text-foreground group-hover:text-primary transition-colors">
                                {title}
                              </span>
                              <span className="text-xs text-muted-foreground">{time}</span>
                            </button>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Footer removed as requested */}
      </aside>
    </>
  )
}
