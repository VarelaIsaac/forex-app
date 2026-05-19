"use client"

import { ArrowRight, BookOpen, CheckCircle2, ChevronRight, Lightbulb, PlayCircle, Shield, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const steps = [
  {
    id: 0,
    title: "Bienvenido a Pancake",
    subtitle: "Tu espacio seguro para aprender trading de forex",
    description: "Este es un entorno de práctica con dinero virtual. Nada de lo que hagas aquí afecta fondos reales. Explora con libertad y comete errores sin preocupación.",
    icon: Shield,
    tip: "Empiezas con $10,000 en moneda virtual para practicar.",
  },
  {
    id: 1,
    title: "Entiende tu panel",
    subtitle: "Sigue tu progreso de un vistazo",
    description: "Estas tarjetas muestran el estado de tu cuenta. Pasa el cursor sobre los iconos ? para aprender qué significa cada métrica.",
    icon: Lightbulb,
    tip: "Tu saldo, beneficio/pérdida y margen disponible se actualizan en tiempo real.",
  },
  {
    id: 2,
    title: "Lee los gráficos de precios",
    subtitle: "Observa cómo cambian las divisas con el tiempo",
    description: "Los gráficos muestran el movimiento del precio. Verde = precio subiendo, rojo = precio bajando. Prueba a cambiar entre pares de divisas para explorar.",
    icon: PlayCircle,
    tip: "Empieza con EUR/USD: es el par más negociado y más fácil de entender.",
  },
  {
    id: 3,
    title: "Haz tu primera operación",
    subtitle: "Practica comprando y vendiendo divisas",
    description: "Usa el panel de operaciones para practicar. Empieza con cantidades pequeñas (0.01 lotes) y coloca siempre un stop loss para limitar posibles pérdidas.",
    icon: BookOpen,
    tip: "COMPRAR si crees que el precio subirá. VENDER si crees que bajará.",
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
  const progressWidthClass =
    step === 0 ? "w-1/4" : step === 1 ? "w-1/2" : step === 2 ? "w-3/4" : "w-full"

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
    <div className="relative rounded-2xl border border-primary/20 bg-linear-to-br from-primary/5 via-card to-card overflow-hidden">
      {/* Progress bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-border">
        <div 
          className={cn("h-full bg-primary transition-all duration-500 ease-out", progressWidthClass)}
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
                  Paso {step + 1} de {steps.length}
                </span>
              </div>
              <h2 className="text-lg font-semibold text-foreground">{currentStep.title}</h2>
              <p className="text-sm text-muted-foreground mt-0.5">{currentStep.subtitle}</p>
            </div>
          </div>
          <button
            onClick={onSkip}
            className="text-muted-foreground hover:text-foreground transition-colors p-1"
            aria-label="Saltar introducción"
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
              <span className="font-medium text-warning">Consejo:</span> {currentStep.tip}
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
                aria-label={`Ir al paso ${i + 1}`}
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
                Atrás
              </Button>
            )}
            <Button
              size="sm"
              onClick={handleNext}
              className="gap-1.5"
            >
              {isLastStep ? "Empezar a operar" : "Siguiente"}
              {isLastStep ? <CheckCircle2 className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </Button>
            {!isLastStep && (
              <Button
                variant="link"
                size="sm"
                onClick={onSkip}
                className="text-muted-foreground text-xs"
              >
                Saltar tutorial
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
