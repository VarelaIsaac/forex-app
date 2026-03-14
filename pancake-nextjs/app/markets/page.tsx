"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@auth0/nextjs-auth0/client"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { HelpPanel } from "@/components/dashboard/help-panel"

const marketHighlights = [
  { pair: "EUR/USD", note: "Most traded, tight spreads" },
  { pair: "GBP/USD", note: "Fast moves, higher volatility" },
  { pair: "USD/JPY", note: "Good for trend spotting" },
]

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

  return (
    <div className="flex h-screen bg-background overflow-hidden font-sans">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header
          onMenuClick={() => setSidebarOpen(true)}
          onHelpClick={() => setHelpOpen(true)}
          title="Markets"
          subtitle="Compare pairs with easy-to-read summaries"
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-5">
          <section className="rounded-2xl bg-card border border-border p-5">
            <h2 className="text-lg font-semibold text-foreground">Popular beginner pairs</h2>
            <p className="text-sm text-muted-foreground mt-1">
              These pairs have reliable liquidity and clear patterns for practice.
            </p>
            <div className="grid gap-4 md:grid-cols-3 mt-5">
              {marketHighlights.map((item) => (
                <div key={item.pair} className="rounded-xl border border-border bg-muted/40 p-4">
                  <p className="text-xs text-muted-foreground">{item.pair}</p>
                  <p className="text-sm font-semibold text-foreground mt-1">{item.note}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl bg-card border border-border p-5">
            <h3 className="text-sm font-semibold text-foreground">How to read a quote</h3>
            <p className="text-xs text-muted-foreground mt-2">
              The first currency is the base, the second is the quote. If EUR/USD is 1.08,
              it means 1 EUR equals 1.08 USD.
            </p>
          </section>
        </main>
      </div>

      <HelpPanel open={helpOpen} onClose={() => setHelpOpen(false)} />
    </div>
  )
}
