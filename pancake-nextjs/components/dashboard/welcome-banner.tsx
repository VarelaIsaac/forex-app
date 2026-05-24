"use client"

import { BookOpen, ChevronRight, GraduationCap, X } from "lucide-react"
import { Button } from "@/components/ui/button"

const steps = [
  { label: "Configura tu cuenta", done: true },
  { label: "Completa tu primera operación", done: false },
  { label: "Explora el análisis de mercado", done: false },
]

interface WelcomeBannerProps {
  onDismiss: () => void
}

export function WelcomeBanner({ onDismiss }: WelcomeBannerProps) {
  const completed = steps.filter((s) => s.done).length
  const pct = Math.round((completed / steps.length) * 100)
  const progressWidthClass = pct === 33 ? "w-1/3" : pct === 67 ? "w-2/3" : "w-full"

  return (
    <div className="relative rounded-xl border border-primary/25 bg-primary/8 overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute inset-0 bg-linear-to-r from-primary/5 to-transparent pointer-events-none" />

      <div className="relative p-5">
        <button
          onClick={onDismiss}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Cerrar banner de bienvenida"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex flex-col sm:flex-row sm:items-start gap-5">
          {/* Icon + text */}
          <div className="flex items-start gap-3 flex-1">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
              <GraduationCap className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-foreground">
                Bienvenido a Pancake: estás en modo práctica
              </h2>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed max-w-lg">
                Estás operando con <span className="text-warning font-medium">$1,000 de dinero virtual</span>. Nada de lo que hagas aquí cuesta dinero real. Explora con libertad y aprende a tu ritmo.
              </p>

              {/* Progress */}
              <div className="mt-3 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Comenzando</span>
                  <span className="text-foreground font-medium">{completed}/{steps.length} completadas</span>
                </div>
                <div className="h-1.5 bg-border rounded-full overflow-hidden w-48">
                  <div
                    className={cn("h-full bg-primary rounded-full transition-all duration-500", progressWidthClass)}
                  />
                </div>
              </div>

              {/* Steps */}
              <ul className="mt-3 space-y-1.5">
                {steps.map((step) => (
                  <li key={step.label} className="flex items-center gap-2 text-xs">
                    <span
                      className={step.done
                        ? "w-4 h-4 rounded-full bg-profit/20 border border-profit flex items-center justify-center shrink-0"
                        : "w-4 h-4 rounded-full border border-border bg-muted shrink-0"
                      }
                    >
                      {step.done && (
                        <svg viewBox="0 0 8 8" className="w-2 h-2 text-profit fill-current">
                          <path d="M1.5 4L3 5.5L6.5 2" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round" />
                        </svg>
                      )}
                    </span>
                    <span className={step.done ? "text-muted-foreground line-through" : "text-foreground"}>
                      {step.label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* CTA buttons */}
          <div className="flex sm:flex-col gap-2 shrink-0">
            <Button size="sm" className="text-xs gap-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              Empezar a aprender
            </Button>
            <Button size="sm" variant="outline" className="text-xs gap-1.5 border-border">
              Ver tutorial
              <ChevronRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
