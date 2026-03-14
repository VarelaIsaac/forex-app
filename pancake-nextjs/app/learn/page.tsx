"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@auth0/nextjs-auth0/client"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { HelpPanel } from "@/components/dashboard/help-panel"

const lessonCards = [
  { title: "Forex basics", detail: "Understand how currency pairs move." },
  { title: "Risk control", detail: "Learn how to protect your balance." },
  { title: "Reading charts", detail: "Spot trends with simple visuals." },
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

  return (
    <div className="flex h-screen bg-background overflow-hidden font-sans">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header
          onMenuClick={() => setSidebarOpen(true)}
          onHelpClick={() => setHelpOpen(true)}
          title="Learn"
          subtitle="Short lessons that keep trading beginner-friendly"
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-5">
          <section className="rounded-2xl bg-card border border-border p-5">
            <h2 className="text-lg font-semibold text-foreground">Start your learning path</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Follow one short lesson at a time and practice after each one.
            </p>
            <div className="grid gap-4 md:grid-cols-3 mt-5">
              {lessonCards.map((lesson) => (
                <div key={lesson.title} className="rounded-xl border border-border bg-muted/40 p-4">
                  <p className="text-xs text-muted-foreground">{lesson.title}</p>
                  <p className="text-sm font-semibold text-foreground mt-1">{lesson.detail}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl bg-card border border-border p-5">
            <h3 className="text-sm font-semibold text-foreground">Nielsen tip</h3>
            <p className="text-xs text-muted-foreground mt-2">
              Each lesson ends with a quick recap so you always know what to do next.
            </p>
          </section>
        </main>
      </div>

      <HelpPanel open={helpOpen} onClose={() => setHelpOpen(false)} />
    </div>
  )
}
