"use client"

import { useEffect, useState } from "react"
import { TutorialGuide, type TutorialStep } from "./tutorial-guide"
import { useLearning } from "@/hooks/use-learning"

type GuidedTutorialPayload = {
  lessonId?: string
  title: string
  description?: string
  steps: TutorialStep[]
}

const STORAGE_KEY = "guidedTutorial"

export function TutorialHost() {
  const { saveProgress } = useLearning()
  const [payload, setPayload] = useState<GuidedTutorialPayload | null>(null)

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY)
      if (!raw) {
        return
      }

      const parsed = JSON.parse(raw) as GuidedTutorialPayload
      if (parsed && parsed.steps?.length) {
        setPayload(parsed)
      }
    } catch {
      // ignore malformed session data
    }
  }, [])

  if (!payload) {
    return null
  }

  return (
    <TutorialGuide
      title={payload.title}
      description={payload.description ?? ""}
      steps={payload.steps}
      onBack={() => {
        setPayload(null)
        try {
          sessionStorage.removeItem(STORAGE_KEY)
        } catch {
          // ignore storage errors
        }
      }}
      onComplete={async () => {
        try {
          if (payload.lessonId) {
            await saveProgress(payload.lessonId, 100, true)
          }
        } catch {
          // best-effort progress save
        }

        setPayload(null)
        try {
          sessionStorage.removeItem(STORAGE_KEY)
        } catch {
          // ignore storage errors
        }
      }}
    />
  )
}