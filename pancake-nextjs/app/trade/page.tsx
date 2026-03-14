"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@auth0/nextjs-auth0/client"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { HelpPanel } from "@/components/dashboard/help-panel"
import { Badge } from "@/components/ui/badge"

export default function TradePage() {
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
          title="Trade"
          subtitle="Place a trade with clear, step-by-step guidance"
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-5">
          <section className="rounded-2xl bg-card border border-border p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Start with a practice trade</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Pick a currency pair, choose BUY or SELL, and start small to learn the flow.
                </p>
              </div>
              <Badge className="bg-primary/15 text-primary border-0">Guided</Badge>
            </div>
            <div className="grid gap-4 md:grid-cols-3 mt-5">
              {[
                { label: "Step 1", value: "Choose a pair" },
                { label: "Step 2", value: "Set trade size" },
                { label: "Step 3", value: "Confirm trade" },
              ].map((item) => (
                <div key={item.label} className="rounded-xl border border-border bg-muted/40 p-4">
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className="text-sm font-semibold text-foreground mt-1">{item.value}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl bg-card border border-border p-5">
            <h3 className="text-sm font-semibold text-foreground">Beginner tips</h3>
            <ul className="text-xs text-muted-foreground mt-3 space-y-2">
              <li>Start with one pair you recognize, like EUR/USD.</li>
              <li>Use smaller amounts while you learn.</li>
              <li>Review the explanation panel before you confirm.</li>
            </ul>
          </section>
        </main>
      </div>

      <HelpPanel open={helpOpen} onClose={() => setHelpOpen(false)} />
    </div>
  )
}
