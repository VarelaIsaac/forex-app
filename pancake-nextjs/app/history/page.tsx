"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@auth0/nextjs-auth0/client"
import { TrendingDown, TrendingUp, AlertCircle, CheckCircle2 } from "lucide-react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { HelpPanel } from "@/components/dashboard/help-panel"
import { useTranslate } from "@/hooks/use-translate"
import { useTrades } from "@/contexts/trades-context"
import { cn } from "@/lib/utils"

export default function HistoryPage() {
  const { user, isLoading } = useUser()
  const router = useRouter()
  const { trades } = useTrades()
  const { t } = useTranslate()
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

  const sortedTrades = [...trades].reverse()

  return (
    <div className="flex h-screen bg-background overflow-hidden font-sans">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header
          onMenuClick={() => setSidebarOpen(true)}
          onHelpClick={() => setHelpOpen(true)}
          title={t("history")}
          subtitle={t("hint-history")}
        />

        <main className="flex-1 overflow-y-auto p-3 md:p-4 space-y-4">
          <section className="rounded-2xl bg-card border border-border p-5">
            <h2 className="text-lg font-semibold text-foreground">{t("history-log-title")}</h2>
            <p className="text-sm text-muted-foreground mt-1">{t("history-log-desc")}</p>
            
            {sortedTrades.length === 0 ? (
              <div className="rounded-xl border border-border bg-muted/40 p-4 mt-4">
                <p className="text-xs text-muted-foreground">Todavía no hay operaciones</p>
                <p className="text-sm font-semibold text-foreground mt-1">
                  Cuando realices una operación, aparecerá aquí con sus resultados.
                </p>
              </div>
            ) : (
              <div className="space-y-2 mt-4">
                {sortedTrades.map((trade) => (
                  <div
                    key={trade.id}
                    className="rounded-lg border border-border bg-muted/40 p-4 hover:bg-muted/60 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              "w-10 h-10 rounded-lg flex items-center justify-center",
                              trade.direction === "buy"
                                ? "bg-profit/10"
                                : "bg-loss/10"
                            )}
                          >
                            {trade.direction === "buy" ? (
                              <TrendingUp className={cn("w-5 h-5", trade.direction === "buy" ? "text-profit" : "text-loss")} />
                            ) : (
                              <TrendingDown className="w-5 h-5 text-loss" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-foreground">
                              {trade.direction.toUpperCase()} {trade.pair}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {trade.size} lots @ {trade.entryPrice.toFixed(5)}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="flex items-center gap-1 justify-end mb-1">
                          {trade.status === "closed" ? (
                            <>
                              <CheckCircle2
                                className={cn(
                                  "w-4 h-4",
                                  (trade.profitLoss ?? 0) > 0 ? "text-profit" : "text-loss"
                                )}
                              />
                              <span
                                className={cn(
                                  "text-sm font-semibold",
                                  (trade.profitLoss ?? 0) > 0 ? "text-profit" : "text-loss"
                                )}
                              >
                                {(trade.profitLoss ?? 0) > 0 ? "+" : ""} ${(trade.profitLoss ?? 0).toFixed(2)}
                              </span>
                            </>
                          ) : (
                            <>
                              <AlertCircle className="w-4 h-4 text-warning" />
                              <span className="text-sm font-semibold text-warning">Abierta</span>
                            </>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {trade.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="rounded-2xl bg-card border border-border p-5">
            <h3 className="text-sm font-semibold text-foreground">Consejo para principiantes</h3>
            <p className="text-xs text-muted-foreground mt-2">
              Revisa una operación al día y anota qué cambiarías la próxima vez.
            </p>
          </section>
        </main>
      </div>

      <HelpPanel open={helpOpen} onClose={() => setHelpOpen(false)} />
    </div>
  )
}
