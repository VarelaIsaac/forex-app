"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@auth0/nextjs-auth0/client"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { useTranslate } from "@/hooks/use-translate"
import { HelpPanel } from "@/components/dashboard/help-panel"

const lessonCards = [
  { id: "forex-basics", title: "Fundamentos de Forex", description: "Entiende cómo se mueven los pares de divisas." },
  { id: "risk-control", title: "Control de riesgo", description: "Aprende a proteger tu saldo." },
  { id: "reading-charts", title: "Lectura de gráficos", description: "Detecta tendencias con visuales simples." },
  { id: "candlestick-patterns", title: "Patrones de velas", description: "Reconoce señales de la acción del precio." },
  { id: "support-resistance", title: "Soporte y resistencia", description: "Encuentra niveles de precio importantes." },
  { id: "lot-sizes", title: "Tamaños de lote", description: "Controla el tamaño de tu posición." },
]

export default function LearnPage() {
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
          title={t("learn")}
          subtitle={t("hint-learn")}
        />

        <main className="flex-1 overflow-y-auto p-3 md:p-4 space-y-4">
          <section className="rounded-2xl bg-card border border-border p-5">
            <h2 className="text-lg font-semibold text-foreground">{t("start-learning")}</h2>
            <p className="text-sm text-muted-foreground mt-1">{t("learn-desc")}</p>
            <div className="grid gap-4 md:grid-cols-3 mt-5">
              {lessonCards.map((lesson) => (
                <button
                  key={lesson.id}
                  onClick={() => router.push(`/learn/${lesson.id}`)}
                  className="rounded-xl border border-border bg-muted/40 p-4 hover:bg-muted/60 transition-colors cursor-pointer text-left"
                >
                  <p className="text-xs text-muted-foreground">{lesson.title}</p>
                  <p className="text-sm font-semibold text-foreground mt-1">{lesson.description}</p>
                </button>
              ))}
            </div>
          </section>
        </main>
      </div>

      <HelpPanel open={helpOpen} onClose={() => setHelpOpen(false)} />
    </div>
  )
}
