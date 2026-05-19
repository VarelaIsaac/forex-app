"use client"

import { useEffect } from "react"
import Link from "next/link"
import { AlertTriangle, ArrowLeft, Home } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="flex items-center justify-center min-h-screen bg-background px-4">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-loss/10 border-2 border-loss flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-loss" />
          </div>
        </div>

        {/* Content */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">¡Vaya!</h1>
          <p className="text-muted-foreground">
            Algo salió mal de nuestro lado. Disculpa las molestias.
          </p>
        </div>

        {/* Error details */}
        <div className="bg-card border border-border rounded-lg p-4 text-left">
          <p className="text-xs font-medium text-muted-foreground mb-2">Detalles del error:</p>
          <p className="text-xs text-muted-foreground font-mono wrap-break-word">
            {error.message || "Ocurrió un error inesperado"}
          </p>
          {error.digest && (
            <p className="text-xs text-muted-foreground font-mono mt-2">
              ID: {error.digest}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <Button
            onClick={reset}
            variant="default"
            className="flex-1 gap-2"
          >
            <AlertTriangle className="w-4 h-4" />
            Reintentar
          </Button>
          <Link href="/" className="flex-1">
            <Button variant="outline" className="w-full gap-2">
              <Home className="w-4 h-4" />
              Inicio
            </Button>
          </Link>
        </div>

        {/* Help text */}
        <p className="text-xs text-muted-foreground">
          Si el problema persiste, contacta con soporte o vuelve a intentarlo más tarde.
        </p>
      </div>
    </div>
  )
}
