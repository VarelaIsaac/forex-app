"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useUser } from "@auth0/nextjs-auth0/client"
import { CheckCircle2, LogOut, Shield, SlidersHorizontal, Sparkles, AlertTriangle, X } from "lucide-react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { HelpPanel } from "@/components/dashboard/help-panel"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

type ProfileData = {
  email?: string
  nombre?: string
  isDemoAccount?: boolean
  tradeCount?: number
  createdAt?: string
}

export default function ProfilePage() {
  const { user, isLoading } = useUser()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [helpOpen, setHelpOpen] = useState(false)
  const [profileData, setProfileData] = useState<ProfileData | null>(null)
  const [profileError, setProfileError] = useState<string | null>(null)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    if (!user) {
      return
    }

    let isActive = true

    const loadProfile = async () => {
      try {
        setProfileError(null)
        const response = await fetch("/api/profile")

        if (!response.ok) {
          throw new Error("Profile request failed")
        }

        const data = (await response.json()) as ProfileData
        if (isActive) {
          setProfileData(data)
        }
      } catch (error) {
        if (isActive) {
          setProfileError("No pudimos cargar tus últimas estadísticas. Intenta de nuevo en unos momentos.")
        }
      }
    }

    loadProfile()

    return () => {
      isActive = false
    }
  }, [user])

  const displayName = useMemo(() => user?.name ?? user?.email ?? "Invitado", [user])
  const initials = useMemo(() => {
    return displayName
      .split(" ")
      .map((word) => word[0])
      .slice(0, 2)
      .join("")
      .toUpperCase()
  }, [displayName])

  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const tradeCount = profileData?.tradeCount ?? 0
  const accountModeLabel = profileData?.isDemoAccount ? "Cuenta de práctica" : "Cuenta real"
  const accountModeHint = profileData?.isDemoAccount
    ? "Fondos virtuales para aprender"
    : "Los fondos reales pueden estar en riesgo"
  const modeBadgeLabel = profileData?.isDemoAccount ? "Modo práctica" : "Modo real"
  const modeBadgeClass = profileData?.isDemoAccount
    ? "bg-primary/15 text-primary"
    : "bg-profit/15 text-profit"

  return (
    <div className="flex h-screen bg-background overflow-hidden font-sans">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header
          onMenuClick={() => setSidebarOpen(true)}
          onHelpClick={() => setHelpOpen(true)}
          title="Perfil"
          subtitle="Gestiona tu cuenta y preferencias"
        />

        <main className="flex-1 overflow-y-auto p-3 md:p-4 space-y-5">
          {profileError && (
            <div className="rounded-xl border border-warning/30 bg-warning/10 px-4 py-3 text-xs text-warning">
              {profileError}
            </div>
          )}
          <section className="grid gap-5 xl:grid-cols-[2fr,1fr]">
            <div className="rounded-2xl bg-card border border-border p-5">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                  {user?.picture ? (
                    <img
                      src={user.picture}
                      alt={displayName}
                      className="w-16 h-16 rounded-2xl object-cover shrink-0"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center text-primary text-lg font-bold shrink-0">
                      {initials}
                    </div>
                  )}
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">{displayName}</h2>
                    <p className="text-sm text-muted-foreground">{user?.email ?? "Sin correo registrado"}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <Badge className={`${modeBadgeClass} border-0`}>{modeBadgeLabel}</Badge>
                      <Badge variant="secondary" className="bg-profit/15 text-profit border-0">
                        Verificado
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowLogoutConfirm(true)}
                    className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Cerrar sesión
                  </button>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2 mt-6">
                <div className="rounded-xl border border-border bg-muted/40 p-4">
                  <p className="text-xs text-muted-foreground">Modo de cuenta</p>
                  <p className="text-sm font-semibold text-foreground mt-1">{accountModeLabel}</p>
                  <p className="text-[11px] text-muted-foreground mt-1">{accountModeHint}</p>
                </div>
                <div className="rounded-xl border border-border bg-muted/40 p-4">
                  <p className="text-xs text-muted-foreground">Operaciones realizadas</p>
                  <p className="text-sm font-semibold text-foreground mt-1">{tradeCount}</p>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    Cada nueva operación suma una aquí.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-card border border-border p-5 space-y-4">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-semibold text-foreground">Lista de seguridad</h3>
              </div>
              <div className="space-y-3">
                {[
                  "Correo verificado",
                  "Autenticación multifactor",
                  "Códigos de respaldo guardados",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <CheckCircle2 className="w-3.5 h-3.5 text-profit" />
                    {item}
                  </div>
                ))}
              </div>
              <button className="w-full rounded-lg bg-primary/15 text-primary text-xs font-semibold py-2 hover:bg-primary/20 transition-colors">
                Revisar seguridad
              </button>
            </div>
          </section>

          <section className="grid gap-5 md:grid-cols-2">
            <div className="rounded-2xl bg-card border border-border p-5 space-y-4">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-semibold text-foreground">Preferencias</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Mercado predeterminado</span>
                  <span className="text-foreground font-medium">EUR/USD</span>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Modo de riesgo</span>
                  <span className="text-foreground font-medium">Conservador</span>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Notificaciones</span>
                  <span className="text-foreground font-medium">Activadas</span>
                </div>
              </div>
              <button className="w-full rounded-lg bg-muted text-foreground text-xs font-semibold py-2 hover:bg-muted/80 transition-colors">
                Actualizar preferencias
              </button>
            </div>

            <div className="rounded-2xl bg-card border border-border p-5 space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-semibold text-foreground">Plan de aprendizaje</h3>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Tu ruta personalizada está completada al 42%. Mantén el impulso con dos lecciones nuevas
                y una simulación de mercado.
              </p>
              <button className="w-full rounded-lg bg-primary/15 text-primary text-xs font-semibold py-2 hover:bg-primary/20 transition-colors">
                Seguir aprendiendo
              </button>
            </div>
          </section>
        </main>
      </div>

      {/* Logout confirmation modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-xl shadow-xl max-w-sm w-full space-y-4 p-6 animate-in fade-in slide-in-from-bottom-4">
            {/* Header with close */}
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-lg font-semibold text-foreground">¿Cerrar sesión?</h3>
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Cerrar diálogo"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="space-y-4">
              {/* Warning */}
              <div className="flex items-start gap-3 rounded-lg bg-warning/10 border border-warning/25 p-4">
                <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-foreground">¿Estás seguro?</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Tendrás que iniciar sesión de nuevo para acceder a tu cuenta y seguir operando.
                  </p>
                </div>
              </div>

              {/* Session info */}
              <div className="bg-muted/50 rounded-lg p-4 text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Cuenta:</span>
                  <span className="font-medium">{displayName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Correo:</span>
                  <span className="font-medium text-xs">{user?.email}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-border">
              <Button
                onClick={() => setShowLogoutConfirm(false)}
                variant="outline"
                className="flex-1"
                disabled={loggingOut}
              >
                Cancelar
              </Button>
              <Link href="/api/auth/logout" className="flex-1">
                <Button
                  disabled={loggingOut}
                  className="w-full bg-loss hover:bg-loss/90"
                  onClick={() => setLoggingOut(true)}
                >
                  {loggingOut ? "Cerrando sesión..." : "Cerrar sesión"}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      <HelpPanel open={helpOpen} onClose={() => setHelpOpen(false)} />
    </div>
  )
}
