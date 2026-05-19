"use client"

import Link from "next/link"
import { Search, ArrowLeft, Home } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background px-4">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-warning/10 border-2 border-warning flex items-center justify-center">
            <Search className="w-8 h-8 text-warning" />
          </div>
        </div>

        {/* Content */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">404</h1>
          <p className="text-lg font-semibold text-foreground">Página no encontrada</p>
          <p className="text-sm text-muted-foreground">
            La página que buscas no existe o se ha movido.
          </p>
        </div>

        {/* Suggestions */}
        <div className="bg-card border border-border rounded-lg p-4 text-left space-y-2">
          <p className="text-xs font-medium text-muted-foreground">Aquí tienes algunos enlaces útiles:</p>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Visita el panel para seguir operando</li>
            <li>• Revisa la sección Aprender para ver tutoriales</li>
            <li>• Vuelve a la página principal</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <Link href="/" className="flex-1">
            <Button className="w-full gap-2">
              <Home className="w-4 h-4" />
              Ir al inicio
            </Button>
          </Link>
          <Button
            onClick={() => window.history.back()}
            variant="outline"
            className="flex-1 gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver
          </Button>
        </div>

        {/* Help text */}
        <p className="text-xs text-muted-foreground">
          ¿Necesitas ayuda? Revisa nuestros recursos de aprendizaje o contacta con soporte.
        </p>
      </div>
    </div>
  )
}
