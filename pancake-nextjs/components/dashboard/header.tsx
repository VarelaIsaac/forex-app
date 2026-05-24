"use client"

import { useEffect, useState, type FormEvent } from "react"
import { Bell, HelpCircle, Menu, Search, Moon, SunMedium } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useUser } from "@auth0/nextjs-auth0/client"
import { useTheme } from "next-themes"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-notifications"
import { useTranslate } from "@/hooks/use-translate"
import { languageLabels } from "@/lib/language"

type PairSuggestion = {
  symbol: string
  price?: number
  note?: string
}

const fallbackPairs: PairSuggestion[] = [
  { symbol: "EUR/USD", price: 1.0842, note: "Most traded, tight spreads" },
  { symbol: "GBP/USD", price: 1.2638, note: "Fast moves, higher volatility" },
  { symbol: "USD/JPY", price: 149.82, note: "Good for trend spotting" },
  { symbol: "AUD/USD", price: 0.6524, note: "Commodity-linked pair" },
  { symbol: "USD/CAD", price: 1.3548, note: "Oil-sensitive pair" },
  { symbol: "NZD/USD", price: 0.6138, note: "Lower liquidity, higher spreads" },
  { symbol: "EUR/GBP", price: 0.8571, note: "Cross pair for EUR and GBP" },
  { symbol: "EUR/JPY", price: 162.4, note: "Popular cross with JPY" },
  { symbol: "USD/CHF", price: 0.8758, note: "Safe-haven pair" },
]

interface HeaderProps {
  onMenuClick: () => void
  onHelpClick: () => void
  title?: string
  subtitle?: string
}

export function Header({ onMenuClick, onHelpClick, title, subtitle }: HeaderProps) {
  const { user } = useUser()
  const { info } = useToast()
  const { t, language } = useTranslate()
  const { resolvedTheme, setTheme } = useTheme()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [suggestions, setSuggestions] = useState<PairSuggestion[]>([])
  const [loadingSuggestions, setLoadingSuggestions] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const firstName = user?.name?.split(" ")[0] ?? user?.email ?? "there"
  const resolvedTitle = title ?? t("dashboard")
  const resolvedSubtitle = subtitle ?? `${t("welcome-back")}${firstName}`
  const isDarkMode = (resolvedTheme ?? "dark") === "dark"

  useEffect(() => {
    const query = searchQuery.trim()

    if (query.length < 2) {
      setSuggestions([])
      setLoadingSuggestions(false)
      return
    }

    const normalizedQuery = query.toLowerCase()
    const fallbackSuggestions = fallbackPairs.filter((pair) => {
      return pair.symbol.toLowerCase().includes(normalizedQuery) || pair.note?.toLowerCase().includes(normalizedQuery)
    })

    setSuggestions(fallbackSuggestions.slice(0, 5))

    let isActive = true
    const timer = setTimeout(() => {
      ;(async () => {
        setLoadingSuggestions(true)
        try {
          const response = await fetch(`/api/trading/pairs?q=${encodeURIComponent(query)}`)
          if (!response.ok) {
            return
          }

          const data = (await response.json()) as PairSuggestion[]
          if (!isActive) {
            return
          }

          setSuggestions((data.length > 0 ? data : fallbackSuggestions).slice(0, 5))
        } catch {
          // Keep the locally filtered fallback suggestions if the API fails.
        } finally {
          if (isActive) {
            setLoadingSuggestions(false)
          }
        }
      })()
    }, 250)

    return () => {
      isActive = false
      clearTimeout(timer)
    }
  }, [searchQuery])

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const query = searchQuery.trim()
    if (!query) {
      return
    }

    router.push(`/markets?q=${encodeURIComponent(query)}`)
  }

  const handleThemeToggle = () => {
    setTheme(isDarkMode ? "light" : "dark")
  }

  const handleNotificationsClick = () => {
    info(t("notifications-coming-soon-title"), {
      description: t("notifications-coming-soon-desc"),
    })
  }

  return (
    <TooltipProvider>
      <header className="h-14 border-b border-border bg-card/60 backdrop-blur-sm flex items-center px-3 md:px-4 gap-3 shrink-0">
        {/* Mobile menu */}
        <button
          onClick={onMenuClick}
          className="xl:hidden text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Abrir menú"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Page title */}
        <div className="hidden md:block">
          <h1 className="text-sm font-semibold text-foreground">{resolvedTitle}</h1>
          <p className="text-[11px] text-muted-foreground">{resolvedSubtitle}</p>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-xs ml-auto md:ml-0">
          <div className="relative">
            <form className="relative" onSubmit={handleSearchSubmit}>
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => {
                  setSearchQuery(event.target.value)
                  setShowSuggestions(true)
                }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => {
                  window.setTimeout(() => setShowSuggestions(false), 150)
                }}
                placeholder={t("search-placeholder")}
                className="w-full bg-muted/50 border border-border rounded-lg pl-8 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50"
                aria-label={t("search-placeholder")}
                autoComplete="off"
              />
            </form>

            {showSuggestions && searchQuery.trim().length >= 2 && (
              <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-50 overflow-hidden rounded-xl border border-border bg-card shadow-xl">
                <div className="border-b border-border px-3 py-2 text-[11px] font-medium text-muted-foreground">
                  {loadingSuggestions ? "Buscando pares..." : "Sugerencias de pares"}
                </div>

                <div className="max-h-72 overflow-y-auto p-1">
                  {suggestions.map((pair) => (
                    <button
                      key={pair.symbol}
                      type="button"
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => {
                        setSearchQuery(pair.symbol)
                        setShowSuggestions(false)
                        router.push(`/markets?q=${encodeURIComponent(pair.symbol)}`)
                      }}
                      className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left transition-colors hover:bg-accent"
                    >
                      <div>
                        <p className="text-xs font-medium text-foreground">{pair.symbol}</p>
                        <p className="text-[11px] text-muted-foreground">
                          {pair.note ?? t("markets-popular-desc")}
                        </p>
                      </div>

                      <div className="ml-3 text-right">
                        <p className="text-[11px] font-medium text-foreground">
                          {typeof pair.price === "number" ? pair.price.toFixed(4) : t("coming-soon")}
                        </p>
                      </div>
                    </button>
                  ))}

                  {!loadingSuggestions && suggestions.length === 0 && (
                    <div className="px-3 py-3 text-xs text-muted-foreground">
                      No encontramos pares con ese texto.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 ml-auto md:ml-0">
          {/* Live status */}
          <div className="hidden sm:flex items-center gap-1.5 bg-profit/10 border border-profit/25 rounded-full px-3 py-1 mr-2">
            <span className="w-1.5 h-1.5 rounded-full bg-profit animate-pulse" />
            <span className="text-xs font-medium text-profit">{t("markets-open")}</span>
          </div>

          {/* Practice mode indicator */}
          <div className="hidden lg:flex items-center gap-1.5 bg-warning/10 border border-warning/25 rounded-full px-3 py-1 mr-2">
            <span className="text-xs font-medium text-warning">{t("practice-mode")}</span>
          </div>

          {/* Language indicator */}
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="hidden sm:flex items-center gap-1.5 bg-primary/10 border border-primary/25 rounded-full px-2 py-1 mr-1">
                <span className="text-xs font-medium text-primary">{languageLabels[language]}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p className="text-xs">{t("language-tooltip")}</p>
            </TooltipContent>
          </Tooltip>

          {/* Help - prominent for beginners */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button 
                onClick={onHelpClick}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
              >
                <HelpCircle className="w-4 h-4" />
                <span className="sr-only">Ayuda</span>
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p className="text-xs">{t("help-tooltip")}</p>
            </TooltipContent>
          </Tooltip>

          {/* Notifications removed per request */}

          {/* Theme toggle */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button 
                onClick={handleThemeToggle}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                aria-label={isDarkMode ? t("switch-to-light") : t("switch-to-dark")}
              >
                {isDarkMode ? <SunMedium className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                <span className="sr-only">{isDarkMode ? t("switch-to-light") : t("switch-to-dark")}</span>
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p className="text-xs">{isDarkMode ? t("switch-to-light") : t("switch-to-dark")}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </header>
    </TooltipProvider>
  )
}
