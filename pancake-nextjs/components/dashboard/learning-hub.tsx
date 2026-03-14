"use client"

import { BookOpen, CheckCircle2, ChevronRight, Clock, PlayCircle, Trophy } from "lucide-react"
import { cn } from "@/lib/utils"

const lessons = [
  {
    id: 1,
    title: "Understanding Currency Pairs",
    duration: "4 min",
    completed: true,
    type: "article",
  },
  {
    id: 2,
    title: "Reading Price Charts",
    duration: "5 min",
    completed: true,
    type: "video",
  },
  {
    id: 3,
    title: "Your First Trade",
    duration: "3 min",
    completed: false,
    current: true,
    type: "interactive",
  },
  {
    id: 4,
    title: "Managing Risk",
    duration: "6 min",
    completed: false,
    type: "article",
  },
]

export function LearningHub() {
  const completedCount = lessons.filter((l) => l.completed).length
  const progress = Math.round((completedCount / lessons.length) * 100)

  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-primary" />
            Learning Path
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">Master forex fundamentals</p>
        </div>
        <div className="flex items-center gap-1.5 bg-primary/10 rounded-full px-2.5 py-1">
          <Trophy className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs font-medium text-primary">{progress}%</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Progress</span>
          <span className="text-foreground font-medium">{completedCount} of {lessons.length} completed</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Lessons */}
      <div className="space-y-1.5">
        {lessons.map((lesson, index) => (
          <button
            key={lesson.id}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all",
              lesson.current
                ? "bg-primary/10 border border-primary/25"
                : "hover:bg-accent"
            )}
          >
            {/* Status indicator */}
            <div
              className={cn(
                "w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-medium",
                lesson.completed
                  ? "bg-profit/20 text-profit"
                  : lesson.current
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {lesson.completed ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : lesson.current ? (
                <PlayCircle className="w-4 h-4" />
              ) : (
                index + 1
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p
                className={cn(
                  "text-xs font-medium truncate",
                  lesson.completed
                    ? "text-muted-foreground line-through"
                    : lesson.current
                    ? "text-foreground"
                    : "text-foreground/80"
                )}
              >
                {lesson.title}
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {lesson.duration}
                </span>
                {lesson.current && (
                  <span className="text-[10px] font-medium text-primary">Continue</span>
                )}
              </div>
            </div>

            <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
          </button>
        ))}
      </div>

      {/* CTA */}
      <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors">
        <PlayCircle className="w-4 h-4" />
        Continue Learning
      </button>
    </div>
  )
}
