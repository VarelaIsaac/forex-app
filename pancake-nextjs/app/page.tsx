"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@auth0/nextjs-auth0/client"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { OnboardingFlow } from "@/components/dashboard/onboarding-flow"
import { StatsRow } from "@/components/dashboard/stats-row"
import { CurrencyChart } from "@/components/dashboard/currency-chart"
import { MarketWatch } from "@/components/dashboard/market-watch"
import { QuickTrade } from "@/components/dashboard/quick-trade"
import { RecentTrades } from "@/components/dashboard/recent-trades"
import { LearningHub } from "@/components/dashboard/learning-hub"
import { HelpPanel } from "@/components/dashboard/help-panel"

export default function DashboardPage() {
  const { user, isLoading } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login")
    }
  }, [user, isLoading, router])

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(true)
  const [helpOpen, setHelpOpen] = useState(false)
  const [onboardingStep, setOnboardingStep] = useState(0)

  const completeOnboarding = () => setShowOnboarding(false)

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
        />

        <main className="flex-1 overflow-y-auto p-3 md:p-4 space-y-4">
          {showOnboarding && (
            <OnboardingFlow
              step={onboardingStep}
              onStepChange={setOnboardingStep}
              onComplete={completeOnboarding}
              onSkip={completeOnboarding}
            />
          )}

          <StatsRow showTutorialHighlight={showOnboarding && onboardingStep === 1} />

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
            <div className="xl:col-span-2 space-y-5">
              <CurrencyChart showTutorialHighlight={showOnboarding && onboardingStep === 2} />
              <RecentTrades />
            </div>
            <div className="space-y-5">
              <QuickTrade showTutorialHighlight={showOnboarding && onboardingStep === 3} />
              <MarketWatch />
              <LearningHub />
            </div>
          </div>
        </main>
      </div>

      <HelpPanel open={helpOpen} onClose={() => setHelpOpen(false)} />
    </div>
  )
}
