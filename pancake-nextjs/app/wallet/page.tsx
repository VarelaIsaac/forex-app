"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@auth0/nextjs-auth0/client"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { useTranslate } from "@/hooks/use-translate"
import { HelpPanel } from "@/components/dashboard/help-panel"
import { Badge } from "@/components/ui/badge"

export default function WalletPage() {
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

  return (
    <div className="flex h-screen bg-background overflow-hidden font-sans">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header
          onMenuClick={() => setSidebarOpen(true)}
          onHelpClick={() => setHelpOpen(true)}
          title={t("wallet")}
          subtitle={t("hint-wallet")}
        />

        <main className="flex-1 overflow-y-auto p-3 md:p-4 space-y-4">
          <section className="rounded-2xl bg-card border border-border p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-foreground">{t("wallet-practice-title")}</h2>
                <p className="text-sm text-muted-foreground mt-1">{t("wallet-practice-desc")}</p>
              </div>
              <Badge className="bg-primary/15 text-primary border-0">Práctica</Badge>
            </div>
            <div className="rounded-xl border border-border bg-muted/40 p-4 mt-5">
              <p className="text-xs text-muted-foreground">Fondos disponibles</p>
              <p className="text-2xl font-semibold text-foreground mt-1">$10,000.00</p>
            </div>
          </section>

          <section className="rounded-2xl bg-card border border-border p-5">
            <h3 className="text-sm font-semibold text-foreground">¿Qué es una cartera?</h3>
            <p className="text-xs text-muted-foreground mt-2">
              Tu cartera guarda el dinero usado para operar. En modo práctica es virtual
              y es seguro experimentar.
            </p>
          </section>
        </main>
      </div>

      <HelpPanel open={helpOpen} onClose={() => setHelpOpen(false)} />
    </div>
  )
}
