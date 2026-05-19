import { useCallback } from "react"
import { toast as sonnerToast } from "sonner"
import { AlertCircle, CheckCircle2, Info, AlertTriangle } from "lucide-react"
import React from "react"

export type ToastType = "success" | "error" | "info" | "warning"

interface ToastOptions {
  description?: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

export function useToast() {
  const showToast = useCallback((
    type: ToastType,
    message: string,
    options?: ToastOptions
  ) => {
    const iconMap: Record<ToastType, React.ReactNode> = {
      success: React.createElement(CheckCircle2, { className: "w-5 h-5" }),
      error: React.createElement(AlertCircle, { className: "w-5 h-5" }),
      warning: React.createElement(AlertTriangle, { className: "w-5 h-5" }),
      info: React.createElement(Info, { className: "w-5 h-5" }),
    }

    const classes = {
      success: "bg-profit/10 border-profit/25 text-profit",
      error: "bg-loss/10 border-loss/25 text-loss",
      warning: "bg-warning/10 border-warning/25 text-warning",
      info: "bg-primary/10 border-primary/25 text-primary",
    }

    return sonnerToast.custom((id) =>
      React.createElement(
        "div",
        { className: `flex items-start gap-3 rounded-lg border p-4 ${classes[type]}` },
        React.createElement("div", { className: "mt-0.5" }, iconMap[type]),
        React.createElement(
          "div",
          { className: "flex-1" },
          React.createElement("p", { className: "text-sm font-medium" }, message),
          options?.description &&
            React.createElement(
              "p",
              { className: "text-xs opacity-75 mt-1" },
              options.description
            )
        ),
        options?.action &&
          React.createElement(
            "button",
            {
              onClick: options.action.onClick,
              className: "text-xs font-medium underline hover:opacity-75 transition-opacity",
            },
            options.action.label
          )
      ),
      {
        duration: options?.duration ?? 4000,
      }
    )
  }, [])

  return {
    success: (message: string, options?: Omit<ToastOptions, "duration">) =>
      showToast("success", message, options),
    error: (message: string, options?: Omit<ToastOptions, "duration">) =>
      showToast("error", message, options),
    warning: (message: string, options?: Omit<ToastOptions, "duration">) =>
      showToast("warning", message, options),
    info: (message: string, options?: Omit<ToastOptions, "duration">) =>
      showToast("info", message, options),
  }
}
