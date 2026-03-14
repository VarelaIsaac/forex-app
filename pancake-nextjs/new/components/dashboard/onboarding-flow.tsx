"use client"

import { ArrowRight, BookOpen, CheckCircle2, ChevronRight, Lightbulb, PlayCircle, Shield, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const steps = [
  {
    id: 0,
    title: "Welcome to ForexPro",
    subtitle: "Your safe space to learn forex trading",
    description: "This is a practice environment with virtual money. Nothing here affects real funds — explore freely and make mistakes without worry.",
    icon: Shield,
    tip: "You start with $10,000 in virtual currency to practice with.",
  },
  {
    id: 1,
    title: "Understand Your Dashboard",
    subtitle: "Track your progress at a glance",
    description: "These cards show your account status. Hover over the ? icons to learn what each metric means.",
    icon: Lightbulb,
    tip: "Your balance, profit/loss, and available margin are updated in real-time.",
  },
  {
    id: 2,
    title: "Read Price Charts",
    subtitle: "See how currency values change over time",
    description: "Charts show price movement. Green = price going up, Red = price going down. Try switching between currency pairs to explore.",
    icon: PlayCircle,
    tip: "Start with EUR/USD — it's the most traded pair and easier to understand.",
  },
  {
    id: 3,
    title: "Place Your First Trade",
    subtitle: "Practice buying and selling currencies",
    description: "Use the trade panel to practice. Start with small amounts (0.01 lots) and always set a stop-loss to limit potential losses.",
    icon: BookOpen,
    tip: "BUY if you think the price will go UP. SELL if you think it will go DOWN.",
  },
]

interface OnboardingFlowProps {
  step: number
  onStepChange: (step: number) => void
  onComplete: () => void
  onSkip: () => void
}

export function OnboardingFlow({ step, onStepChange, onComplete, onSkip }: OnboardingFlowProps) {
  const currentStep = steps[step]
  const isLastStep = step === steps.length - 1
  const Icon = currentStep.icon

  const handleNext = () => {
    if (isLastStep) {
      onComplete()
    } else {
      onStepChange(step + 1)
    }
  }

  const handleBack = () => {
    if (step > 0) {
      onStepChange(step - 1)
    }
  }

  return (
    <div className="relative rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-card to-card overflow-hidden">
      {/* Progress bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-border">
        <div 
          className="h-full bg-primary transition-all duration-500 ease-out"
          style={{ width: `${((step + 1) / steps.length) * 100}%` }}
        />
      </div>

      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
              <Icon className="w-6 h-6 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                  Step {step + 1} of {steps.length}
                </span>
              </div>
              <h2 className="text-lg font-semibold text-foreground">{currentStep.title}</h2>
              <p className="text-sm text-muted-foreground mt-0.5">{currentStep.subtitle}</p>
            </div>
          </div>
          <button
            onClick={onSkip}
            className="text-muted-foreground hover:text-foreground transition-colors p-1"
            aria-label="Skip onboarding"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="mt-5 pl-16">
          <p className="text-sm text-foreground/80 leading-relaxed max-w-2xl">
            {currentStep.description}
          </p>

          {/* Tip box */}
          <div className="mt-4 flex items-start gap-3 bg-warning/8 border border-warning/20 rounded-lg px-4 py-3 max-w-xl">
            <Lightbulb className="w-4 h-4 text-warning mt-0.5 shrink-0" />
            <p className="text-xs text-foreground/80 leading-relaxed">
              <span className="font-medium text-warning">Pro tip:</span> {currentStep.tip}
            </p>
          </div>
        </div>

        {/* Step indicators */}
        <div className="mt-6 pl-16 flex items-center gap-6">
          <div className="flex items-center gap-2">
            {steps.map((s, i) => (
              <button
                key={s.id}
                onClick={() => onStepChange(i)}
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all",
                  i < step
                    ? "bg-profit/20 text-profit"
                    : i === step
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-accent"
                )}
                aria-label={`Go to step ${i + 1}`}
              >
                {i < step ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
              </button>
            ))}
          </div>

          <div className="flex-1" />

          {/* Navigation buttons */}
          <div className="flex items-center gap-2">
            {step > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                className="text-muted-foreground"
              >
                Back
              </Button>
            )}
            <Button
              size="sm"
              onClick={handleNext}
              className="gap-1.5"
            >
              {isLastStep ? "Start Trading" : "Next"}
              {isLastStep ? <CheckCircle2 className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </Button>
            {!isLastStep && (
              <Button
                variant="link"
                size="sm"
                onClick={onSkip}
                className="text-muted-foreground text-xs"
              >
                Skip tutorial
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
