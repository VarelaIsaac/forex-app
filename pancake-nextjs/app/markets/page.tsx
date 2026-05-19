"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@auth0/nextjs-auth0/client"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { useTranslate } from "@/hooks/use-translate"
import { HelpPanel } from "@/components/dashboard/help-panel"

export default function MarketsPage() {
  const { user, isLoading } = useUser()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [helpOpen, setHelpOpen] = useState(false)

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login")
    }
  }, [user, isLoading, router])

  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const { t } = useTranslate()
  const [query, setQuery] = useState("")
  const [pairs, setPairs] = useState<Array<{ symbol: string; price?: number }>>([])
  const [loadingPairs, setLoadingPairs] = useState(false)

  useEffect(() => {
    let mounted = true
    const timer = setTimeout(() => {
      ;(async () => {
        setLoadingPairs(true)
        try {
          const url = '/api/trading/pairs' + (query ? `?q=${encodeURIComponent(query)}` : '')
          const res = await fetch(url)
          if (!res.ok) throw new Error('Failed to load pairs')
          const data = await res.json()
          if (!mounted) return
          const normalized = data.map((q: any) => ({ symbol: q.symbol || q.pair || q.name, price: q.price, note: q.note }))
          setPairs(normalized)
        } catch (err) {
          console.error('Error loading pairs:', err)
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

  const filtered = pairs.filter((p) => {
    const q = query.trim().toLowerCase()
    if (!q) return true
    return p.symbol.toLowerCase().includes(q) || (p.price?.toString() || '').includes(q)
  })

  return (
    <div className="flex h-screen bg-background overflow-hidden font-sans">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header
          onMenuClick={() => setSidebarOpen(true)}
          onHelpClick={() => setHelpOpen(true)}
          title={t("markets")}
          subtitle={t("hint-markets")}
        />

        <main className="flex-1 overflow-y-auto p-3 md:p-4 space-y-4">
          <section className="rounded-2xl bg-card border border-border p-5">
            <h2 className="text-lg font-semibold text-foreground">{t("markets-popular-title")}</h2>
            <p className="text-sm text-muted-foreground mt-1">{t("markets-popular-desc")}</p>
            <div className="mt-4">
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("search-placeholder")}
                className="w-full bg-muted border border-border rounded-lg pl-3 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />

              <div className="grid gap-4 md:grid-cols-3 mt-5">
                {loadingPairs && (
                  <div className="col-span-full text-sm text-muted-foreground">{t('loading')}</div>
                )}

                {filtered.map((item) => (
                  <div key={item.symbol} className="rounded-xl border border-border bg-muted/40 p-4">
                    <p className="text-xs text-muted-foreground">{item.symbol}</p>
                    <p className="text-sm font-semibold text-foreground mt-1">{item.price ?? t('coming-soon')}</p>
                  </div>
                ))}

                {!loadingPairs && filtered.length === 0 && (
                  <div className="col-span-full text-sm text-muted-foreground mt-2">{t('no-results')}</div>
                )}
              </div>
            </div>
          </section>

          <section className="rounded-2xl bg-card border border-border p-5">
            <h3 className="text-sm font-semibold text-foreground">Cómo leer una cotización</h3>
            <p className="text-xs text-muted-foreground mt-2">
              La primera divisa es la base y la segunda es la cotizada. Si EUR/USD está en 1.08,
              significa que 1 EUR equivale a 1.08 USD.
            </p>
          </section>
        </main>
      </div>

      <HelpPanel open={helpOpen} onClose={() => setHelpOpen(false)} />
    </div>
  )
}
