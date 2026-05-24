"use client"

import { useEffect, useState, type ReactNode } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useUser } from "@auth0/nextjs-auth0/client"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { useTranslate } from "@/hooks/use-translate"
import { HelpPanel } from "@/components/dashboard/help-panel"
import styles from "./markets-patterns.module.css"

const fallbackPairs = [
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

function getFallbackPrice(symbol: string) {
  return fallbackPairs.find((pair) => pair.symbol === symbol)?.price
}

function PatternCard({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string
  title: string
  description: string
  children: ReactNode
}) {
  return (
    <div className="rounded-2xl border border-primary/15 bg-primary/5 p-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{eyebrow}</p>
          <h3 className="mt-2 text-lg font-semibold text-foreground">{title}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        </div>

        <div className={`rounded-xl border border-border bg-card p-4 ${styles.cardMinWidth}`}>
          <p className={`text-center text-muted-foreground ${styles.visualLabel}`}>
            Ejemplo visual
          </p>
          <div className="mt-3">{children}</div>
        </div>
      </div>
    </div>
  )
}

function MiniDoji() {
  return (
    <div className={`relative flex h-24 items-center justify-center border border-white/8 bg-[#0b1220] p-4 ${styles.cardShell}`}>
      <span className="absolute left-1/2 top-2 h-16 w-px -translate-x-1/2 bg-white/10" />
      <span className="absolute left-1/2 bottom-2 h-16 w-px -translate-x-1/2 bg-white/10" />
      <span className={`relative h-2.5 w-10 rounded-full bg-sky-500 ${styles.shadowDoji}`} />
    </div>
  )
}

function MiniHammer() {
  return (
    <div className={`relative flex h-24 items-end justify-center border border-white/8 bg-[#0b1220] p-4 ${styles.cardShell}`}>
      <span className="absolute left-1/2 top-2 h-12 w-px -translate-x-1/2 bg-white/10" />
      <span className="absolute left-1/2 bottom-2 h-16 w-px -translate-x-1/2 bg-white/10" />
      <span className={`relative h-4 w-8 rounded-full bg-emerald-500 ${styles.shadowHammer}`} />
    </div>
  )
}

function MiniEngulfing() {
  return (
    <div className={`relative flex h-24 items-end justify-center gap-3 border border-white/8 bg-[#0b1220] p-4 ${styles.cardShell}`}>
      <div className="relative h-16 w-10">
        <span className="absolute left-1/2 top-1 h-10 w-px -translate-x-1/2 bg-white/10" />
        <span className="absolute left-1/2 bottom-0 h-8 w-px -translate-x-1/2 bg-white/10" />
        <span className="absolute left-1/2 top-6 h-4 w-6 -translate-x-1/2 rounded-sm bg-rose-500" />
      </div>
      <div className="relative h-16 w-12">
        <span className="absolute left-1/2 top-0 h-12 w-px -translate-x-1/2 bg-white/10" />
        <span className="absolute left-1/2 bottom-0 h-10 w-px -translate-x-1/2 bg-white/10" />
        <span className={`absolute left-1/2 top-3 h-10 w-8 -translate-x-1/2 rounded-sm bg-emerald-500 ${styles.shadowHammer}`} />
      </div>
    </div>
  )
}

function MiniContext() {
  return (
    <div className={`relative flex h-24 items-center justify-center border border-white/8 bg-[#0b1220] p-4 ${styles.cardShell}`}>
      <span className={`absolute top-3 h-16 w-px bg-white/10 ${styles.offsetMinus28}`} />
      <span className="absolute left-1/2 top-2 h-20 w-px -translate-x-1/2 bg-white/10" />
      <span className={`absolute top-3 h-16 w-px bg-white/10 ${styles.offsetPlus28}`} />
      <div className={`absolute top-9 text-center ${styles.offsetMinus34}`}>
        <p className="text-[10px] uppercase tracking-[0.18em] text-white/40">Trend</p>
        <span className="mt-2 block h-8 w-1 rounded-full bg-emerald-500/90" />
      </div>
      <div className={`absolute top-9 text-center ${styles.offsetPlus24}`}>
        <p className="text-[10px] uppercase tracking-[0.18em] text-white/40">Level</p>
        <span className="mt-2 block h-1 w-10 rounded-full bg-sky-500/80" />
      </div>
    </div>
  )
}

export function MarketsClient() {
  const { user, isLoading } = useUser()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { t } = useTranslate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [helpOpen, setHelpOpen] = useState(false)
  const [query, setQuery] = useState(() => searchParams.get("q") ?? "")
  const [pairs, setPairs] = useState<Array<{ symbol: string; price?: number }>>([])
  const [loadingPairs, setLoadingPairs] = useState(false)

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    setQuery(searchParams.get("q") ?? "")
  }, [searchParams])

  useEffect(() => {
    let mounted = true
    const timer = setTimeout(() => {
      ;(async () => {
        setLoadingPairs(true)
        try {
          const url = "/api/trading/pairs" + (query ? `?q=${encodeURIComponent(query)}` : "")
          const res = await fetch(url)
          const data = res.ok
            ? await res.json()
            : fallbackPairs.filter((pair) => {
                const q = query.trim().toLowerCase()
                if (!q) return true
                return pair.symbol.toLowerCase().includes(q) || pair.note.toLowerCase().includes(q)
              })

          if (!mounted) return

          const normalized = data.map((item: any) => {
            const symbol = item.symbol || item.pair || item.name
            return {
              symbol,
              price: item.price ?? getFallbackPrice(symbol),
            }
          })

          setPairs(normalized)
        } catch {
          if (!mounted) return
          const q = query.trim().toLowerCase()
          const normalized = fallbackPairs
            .filter((pair) => {
              if (!q) return true
              return pair.symbol.toLowerCase().includes(q) || pair.note.toLowerCase().includes(q)
            })
            .map((pair) => ({ symbol: pair.symbol, price: pair.price }))
          setPairs(normalized)
        } finally {
          if (mounted) setLoadingPairs(false)
        }
      })()
    }, 250)

    return () => {
      mounted = false
      clearTimeout(timer)
    }
  }, [query])

  if (isLoading || !user) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  const handleQueryChange = (value: string) => {
    setQuery(value)
    const nextQuery = value.trim()
    router.replace(nextQuery ? `/markets?q=${encodeURIComponent(nextQuery)}` : "/markets", { scroll: false })
  }

  const filtered = pairs.filter((pair) => {
    const q = query.trim().toLowerCase()
    if (!q) return true
    return pair.symbol.toLowerCase().includes(q) || (pair.price?.toString() || "").includes(q)
  })

  return (
    <div className="flex h-screen overflow-hidden bg-background font-sans">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Header
          onMenuClick={() => setSidebarOpen(true)}
          onHelpClick={() => setHelpOpen(true)}
          title={t("markets")}
          subtitle={t("hint-markets")}
        />

        <main className="flex-1 space-y-4 overflow-y-auto p-3 md:p-4">
          <section className="rounded-2xl border border-border bg-card p-5">
            <h2 className="text-lg font-semibold text-foreground">{t("markets-popular-title")}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{t("markets-popular-desc")}</p>
            <div className="mt-4">
              <input
                type="search"
                value={query}
                onChange={(e) => handleQueryChange(e.target.value)}
                placeholder={t("search-placeholder")}
                className="w-full rounded-lg border border-border bg-muted px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />

              <div className="mt-5 grid gap-4 md:grid-cols-3">
                {loadingPairs && <div className="col-span-full text-sm text-muted-foreground">{t("loading")}</div>}

                {filtered.map((item) => (
                  <div key={item.symbol} className="rounded-xl border border-border bg-muted/40 p-4">
                    <p className="text-xs text-muted-foreground">{item.symbol}</p>
                    <p className="mt-1 text-sm font-semibold text-foreground">
                      {typeof item.price === "number" ? item.price.toFixed(item.symbol.includes("JPY") ? 3 : 4) : "--"}
                    </p>
                  </div>
                ))}

                {!loadingPairs && filtered.length === 0 && (
                  <div className="col-span-full mt-2 text-sm text-muted-foreground">{t("no-results")}</div>
                )}
              </div>
            </div>
          </section>

          <section data-doji-callout className="rounded-2xl border border-primary/20 bg-primary/5 p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="max-w-2xl">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Patrón Doji</p>
                <h3 className="mt-2 text-lg font-semibold text-foreground">Una vela Doji muestra indecisión</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Cuando la apertura y el cierre quedan casi al mismo nivel, el cuerpo de la vela se reduce y las
                  mechas destacan. Suele indicar una pausa o posible cambio de impulso.
                </p>
              </div>

              <div className="rounded-xl border border-border bg-card px-4 py-3 text-center md:min-w-48">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Ejemplo visual</p>
                <div className="mt-3 flex items-center justify-center gap-4">
                  <div className="relative flex h-20 w-10 items-center justify-center">
                    <span className="absolute h-full w-px rounded-full bg-muted-foreground/25" />
                    <span className={`relative h-2 w-7 rounded-full bg-primary ${styles.shadowDoji}`} />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-foreground">Apertura ≈ cierre</p>
                    <p className="text-xs text-muted-foreground">Mechas largas, cuerpo pequeño</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <PatternCard
              eyebrow="Patrones rápidos"
              title="Hammer y Hanging Man"
              description="El Hammer puede señalar reversión de bajista a alcista. El Hanging Man es la versión bajista."
            >
              <MiniHammer />
            </PatternCard>

            <PatternCard
              eyebrow="Patrones de reversión"
              title="Patrones Engulfing"
              description="Un engulfing alcista tiene una vela pequeña seguida por otra mayor que la cubre, indicando posible reversión."
            >
              <MiniEngulfing />
            </PatternCard>

            <PatternCard
              eyebrow="Confirmación"
              title="Usar Patrones en Trading"
              description="Combina patrones con soporte/resistencia y la tendencia para mayor fiabilidad."
            >
              <MiniContext />
            </PatternCard>
          </section>

          <section className="rounded-2xl border border-border bg-card p-5">
            <h3 className="text-sm font-semibold text-foreground">Cómo leer una cotización</h3>
            <p className="mt-2 text-xs text-muted-foreground">
              La primera divisa es la base y la segunda es la cotizada. Si EUR/USD está en 1.08, significa que 1 EUR
              equivale a 1.08 USD.
            </p>
          </section>
        </main>
      </div>

      <HelpPanel open={helpOpen} onClose={() => setHelpOpen(false)} />
    </div>
  )
}
