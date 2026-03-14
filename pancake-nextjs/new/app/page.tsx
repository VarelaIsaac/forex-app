"use client"

import { useState } from "react"
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
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(true)
  const [helpOpen, setHelpOpen] = useState(false)
  const [onboardingStep, setOnboardingStep] = useState(0)

  const completeOnboarding = () => {
    setShowOnboarding(false)
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden font-sans">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header 
          onMenuClick={() => setSidebarOpen(true)} 
          onHelpClick={() => setHelpOpen(true)}
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-5">
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
