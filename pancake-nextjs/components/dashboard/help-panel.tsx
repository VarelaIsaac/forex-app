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
import { translations } from "@/lib/language"

interface HelpPanelProps {
  open: boolean
  onClose: () => void
}

export function HelpPanel({ open, onClose }: HelpPanelProps) {
  const { t, language } = useTranslate()
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

  const categories = [
    { id: "getting-started", labelKey: "getting-started", icon: Zap, articleKey: "help.article.getting-started" },
    { id: "trading-basics", labelKey: "trading-basics", icon: TrendingUp, articleKey: "help.article.trading-basics" },
    { id: "strategies", labelKey: "simple-strategies", icon: Lightbulb, articleKey: "help.article.strategies" },
  ]

  const faqs = [0, 1, 2, 3].map((i) => ({ q: t(`faq.q.${i}`), a: t(`faq.a.${i}`) }))

  const lookup = (key: string) => translations[language]?.[key] ?? translations.es[key] ?? null

  const catCount = (baseKey: string) => {
    let count = 0
    for (let i = 0; i < 8; i++) {
      if (lookup(`${baseKey}.${i}.title`)) count++
      else break
    }
    return count
  }

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
              <h2 className="text-sm font-semibold text-foreground">{t("help-title")}</h2>
              <p className="text-xs text-muted-foreground">{t("help-description")}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            aria-label="Cerrar panel de ayuda"
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
              placeholder={t("search-help-placeholder")}
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
              {t("learning-guides")}
            </h3>
            <div className="space-y-2">
              {categories.map((cat) => {
                const Icon = cat.icon
                const isExpanded = activeCategory === cat.id
                const baseKey = cat.articleKey

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
                        <p className="text-xs text-muted-foreground">{lookup(`${baseKey}.0.time`) ? catCount(cat.articleKey) : 0} {t("articles-label")}</p>
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
                          const title = lookup(`${baseKey}.${i}.title`)
                          const time = lookup(`${baseKey}.${i}.time`)
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
