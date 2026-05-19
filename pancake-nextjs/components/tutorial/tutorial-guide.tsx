"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { SpotlightOverlay } from "./spotlight-overlay"
import { useTranslate } from "@/hooks/use-translate"

export interface TutorialStep {
  title: string
  description: string
  elementSelector?: string
  elementId?: string
  action?: string
}

interface TutorialGuideProps {
  title: string
  description: string
  steps: TutorialStep[]
  onComplete?: () => void
  onBack?: () => void
}

export function TutorialGuide({
  title,
  description,
  steps,
  onComplete,
  onBack,
}: TutorialGuideProps) {
  const { t } = useTranslate()
  const [currentStep, setCurrentStep] = useState(0)
  const step = steps[currentStep]
  const isFirst = currentStep === 0
  const isLast = currentStep === steps.length - 1

  const handleNext = () => {
    if (isLast) {
      onComplete?.()
    } else {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrev = () => {
    if (!isFirst) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <div>
      {step.elementSelector && (
        <SpotlightOverlay
          elementSelector={step.elementSelector}
          radius={12}
          opacity={0.75}
        />
      )}

      <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-card border border-border rounded-2xl p-5 shadow-lg z-50">
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold text-foreground">{title}</h2>
                <span className="text-xs font-medium text-muted-foreground bg-muted/40 px-2 py-1 rounded">
                {t("step")} {currentStep + 1} {t("of")} {steps.length}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>

          <div className="bg-muted/20 border border-muted/40 rounded-lg p-4">
            <h3 className="font-semibold text-foreground mb-2">{step.title}</h3>
            <p className="text-sm text-muted-foreground">{step.description}</p>
            {step.action && (
              <div className="mt-3 text-xs font-medium text-primary bg-primary/10 px-3 py-2 rounded border border-primary/20 flex items-start gap-2">
                <span className="mt-0.5">💡</span>
                <span>{step.action}</span>
              </div>
            )}
          </div>

          <div className="flex gap-2 justify-between">
            <div className="flex gap-2">
              <button
                onClick={onBack}
                className="px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted/40 rounded-lg transition-colors border border-muted/40"
              >
                {t("exit")}
              </button>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handlePrev}
                disabled={isFirst}
                className="p-2 text-muted-foreground hover:bg-muted/40 rounded-lg transition-colors border border-muted/40 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Paso anterior"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                className="px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg transition-colors font-medium text-sm flex items-center gap-2"
              >
                {isLast ? t("complete") : t("next")}
                {!isLast && <ChevronRight className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
