"use client"

import { useUser } from "@auth0/nextjs-auth0/client"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function LoginPage() {
  const { user, isLoading } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && user) {
      router.replace("/")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-8 shadow-lg space-y-6">
        {/* Logo / branding */}
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">Pancake</h1>
          <p className="text-sm text-muted-foreground">
            Trading de forex
          </p>
        </div>

        {/* Login button */}
        <a
          href="/auth/login"
          className="flex w-full items-center justify-center rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow transition-opacity hover:opacity-90 active:opacity-75"
        >
          Iniciar sesión con Auth0
        </a>

        <p className="text-center text-xs text-muted-foreground">
          ¿Es tu primera vez? Auth0 te permitirá crear una cuenta en la siguiente pantalla.
        </p>
      </div>
    </div>
  )
}
