"use client"

import { useEffect, useMemo, useState } from "react"
import { BookOpen, CheckCircle2, ChevronRight, Clock, PlayCircle, Trophy } from "lucide-react"
import { cn } from "@/lib/utils"
import { useLearning } from "@/hooks/use-learning"
import { useRouter } from "next/navigation"
import { useTranslate } from "@/hooks/use-translate"

const lessons = [
  {
    slug: "forex-basics",
    title: "Fundamentos de Forex",
    duration: "4 min",
    completed: false,
    current: true,
    description: "Aprende cómo se mueven los pares de divisas.",
    focus: "Identifica el par base/quote antes de abrir cualquier operación.",
    highlights: ["Qué es un pip", "Cómo leer un par", "Cómo mover el precio"],
  },
  {
    slug: "reading-charts",
    title: "Lectura de gráficos",
    duration: "5 min",
    completed: false,
    description: "Empieza a reconocer tendencias y retrocesos.",
    focus: "Mira la dirección general antes de buscar entradas.",
    highlights: ["Tendencia alcista", "Tendencia bajista", "Niveles clave"],
  },
  {
    slug: "risk-control",
    title: "Control de riesgo",
    duration: "6 min",
    completed: false,
    description: "Protege tu saldo con reglas simples y repetibles.",
    focus: "Define tu stop loss y el tamaño de lote antes de confirmar.",
    highlights: ["Regla del 1%", "Stop loss", "Relación riesgo/recompensa"],
  },
  {
    slug: "support-resistance",
    title: "Soporte y resistencia",
    duration: "6 min",
    completed: false,
    description: "Encuentra zonas donde el precio suele reaccionar.",
    focus: "Busca rebotes o rechazos en los niveles más tocados.",
    highlights: ["Soportes fuertes", "Resistencias", "Zonas de reacción"],
  },
]

export function LearningHub() {
  const router = useRouter()
  const { t } = useTranslate()
  const { saveProgress, progress: backendProgress } = useLearning()
  const [selectedLessonSlug, setSelectedLessonSlug] = useState(
    lessons.find((lesson) => lesson.current)?.slug ?? lessons[0].slug,
  )

  const mergedLessons = useMemo(() => {
    if (!backendProgress || backendProgress.length === 0) return lessons
    return lessons.map((lesson) => {
      const p = backendProgress.find((b: any) => b.lessonSlug === lesson.slug)
      if (!p) return lesson
      return {
        ...lesson,
        completed: typeof p.completed === 'boolean' ? p.completed : lesson.completed,
        progress: typeof p.progress === 'number' ? p.progress : (lesson as any).progress ?? 0,
      }
    })
  }, [backendProgress])

  const selectedLesson = useMemo(
    () => (
      mergedLessons.find((lesson) => lesson.slug === selectedLessonSlug) ?? mergedLessons[0]
    ),
    [selectedLessonSlug, mergedLessons],
  )

  useEffect(() => {
    if (!lessons.some((lesson) => lesson.slug === selectedLessonSlug)) {
      setSelectedLessonSlug(lessons.find((lesson) => lesson.current)?.slug ?? lessons[0].slug)
    }
  }, [selectedLessonSlug])

  const completedCount = mergedLessons.filter((l) => l.completed).length
  const progress = Math.round((completedCount / mergedLessons.length) * 100)

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <BookOpen className="h-4 w-4 text-primary" />
                {t("learning-roadmap")}
              </h2>
              <p className="mt-0.5 text-xs text-muted-foreground">{t("learning-roadmap-subtitle")}</p>
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1">
              <Trophy className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-medium text-primary">{progress}%</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">{t("learning-progress")}</span>
              <span className="font-medium text-foreground">
                {completedCount} de {lessons.length} completadas
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all duration-700 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            {mergedLessons.map((lesson, index) => {
              const isSelected = lesson.slug === selectedLesson.slug

              return (
                <button
                  key={lesson.slug}
                  onClick={() => {
                    // if lesson not completed, navigate to the lesson page to perform it
                    if (!lesson.completed) {
                      router.push(`/learn/${lesson.slug}`)
                      return
                    }
                    setSelectedLessonSlug(lesson.slug)
                  }}
                  className={cn(
                    "group flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:bg-accent",
                    isSelected
                      ? "border-primary/30 bg-primary/10 shadow-sm ring-1 ring-primary/15"
                      : "border-transparent",
                  )}
                >
                  <div
                    className={cn(
                      "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-medium transition-all",
                      lesson.completed
                        ? "bg-profit/20 text-profit"
                        : lesson.current
                          ? "animate-pulse bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground",
                    )}
                  >
                    {lesson.completed ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : lesson.current ? (
                      <PlayCircle className="h-4 w-4" />
                    ) : (
                      index + 1
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p
                        className={cn(
                          "truncate text-xs font-medium",
                          lesson.completed
                            ? "text-muted-foreground line-through"
                            : lesson.current
                              ? "text-foreground"
                              : "text-foreground/80",
                        )}
                      >
                        {lesson.title}
                      </p>
                      {lesson.current && (
                        <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
                          {t("learning-current")}
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 truncate text-[11px] text-muted-foreground">{lesson.description}</p>
                    <div className="mt-0.5 flex items-center gap-2">
                      <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {lesson.duration}
                      </span>
                      {lesson.current && <span className="text-[10px] font-medium text-primary">{t("continue")}</span>}
                    </div>
                  </div>

                  <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                </button>
              )
            })}
          </div>

          <button
            onClick={() => router.push("/learn")}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <PlayCircle className="h-4 w-4" />
            {t("start-learning")}
          </button>
        </div>

        <aside className="space-y-4 rounded-2xl border border-border bg-muted/25 p-4">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                {t("learning-practice-preview")}
              </p>
              <h3 className="mt-1 text-sm font-semibold text-foreground">{selectedLesson.title}</h3>
            </div>
            <span
              className={cn(
                "rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-wide",
                selectedLesson.completed ? "bg-profit/15 text-profit" : "bg-primary/10 text-primary",
              )}
            >
              {selectedLesson.completed ? t("learning-completed") : t("learning-in-progress")}
            </span>
          </div>

          <div className="rounded-xl border border-border bg-card p-4 shadow-sm transition-all duration-300">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                <BookOpen className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-foreground">{selectedLesson.description}</p>
                <p className="text-[11px] text-muted-foreground">
                  {selectedLesson.completed ? t("learning-reviewed") : t("learning-pending")}
                </p>
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-primary/15 bg-primary/5 p-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
                {t("learning-focus")}
              </p>
              <p className="mt-1 text-sm text-foreground">{selectedLesson.focus}</p>
            </div>

            <div className="mt-4 space-y-2">
              {selectedLesson.highlights.map((highlight, index) => (
                <div key={highlight} className="flex items-center gap-2 rounded-lg bg-muted/70 px-3 py-2 text-sm text-foreground">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary">
                    {index + 1}
                  </span>
                  <span>{highlight}</span>
                </div>
              ))}
            </div>

              <button
                onClick={async () => {
                  // mark as in-progress then navigate
                  try {
                    await saveProgress(selectedLesson.slug, 10, false)
                  } catch (e) {
                    // ignore
                  }
                  router.push(`/learn/${selectedLesson.slug}`)
                }}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-xs font-medium text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-md"
            >
              <PlayCircle className="h-4 w-4" />
                {selectedLesson.current ? t("continue") : t("learning-open-lesson")}
            </button>
          </div>

          <div className="rounded-xl border border-dashed border-primary/25 bg-primary/5 p-3">
            <p className="text-xs font-semibold text-primary">{t("learning-next-step")}</p>
            <p className="mt-1 text-sm text-foreground">
              {t("learning-next-step-copy")}
            </p>
          </div>
        </aside>
      </div>
    </div>
  )
}
