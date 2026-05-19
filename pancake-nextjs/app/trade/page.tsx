"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@auth0/nextjs-auth0/client"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { HelpPanel } from "@/components/dashboard/help-panel"
import { QuickTrade } from "@/components/dashboard/quick-trade"
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
          title="Operar"
          subtitle="Realiza una operación con una guía clara paso a paso"
        />

        <main className="flex-1 overflow-y-auto p-3 md:p-4 space-y-4">
          <QuickTrade />

          <section className="rounded-2xl bg-card border border-border p-5">
            <h3 className="text-sm font-semibold text-foreground">Consejos para principiantes</h3>
            <ul className="text-xs text-muted-foreground mt-3 space-y-2">
              <li>Empieza con un par que reconozcas, como EUR/USD.</li>
              <li>Usa cantidades pequeñas mientras aprendes.</li>
              <li>Revisa el panel de explicación antes de confirmar.</li>
            </ul>
          </section>
        </main>
      </div>

      <HelpPanel open={helpOpen} onClose={() => setHelpOpen(false)} />
    </div>
  )
}
