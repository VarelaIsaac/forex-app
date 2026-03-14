"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useUser } from "@auth0/nextjs-auth0/client"
import { CheckCircle2, LogOut, Shield, SlidersHorizontal, Sparkles } from "lucide-react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { HelpPanel } from "@/components/dashboard/help-panel"
import { Badge } from "@/components/ui/badge"

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
          setProfileError("We could not load your latest stats. Try again soon.")
        }
      }
    }

    loadProfile()

    return () => {
      isActive = false
    }
  }, [user])

  const displayName = useMemo(() => user?.name ?? user?.email ?? "Guest", [user])
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
  const accountModeLabel = profileData?.isDemoAccount ? "Practice account" : "Live account"
  const accountModeHint = profileData?.isDemoAccount
    ? "Virtual funds for learning"
    : "Real funds may be at risk"
  const modeBadgeLabel = profileData?.isDemoAccount ? "Practice Mode" : "Live Mode"
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
          title="Profile"
          subtitle="Manage your account and preferences"
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
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
                    <p className="text-sm text-muted-foreground">{user?.email ?? "No email on file"}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <Badge className={`${modeBadgeClass} border-0`}>{modeBadgeLabel}</Badge>
                      <Badge variant="secondary" className="bg-profit/15 text-profit border-0">
                        Verified
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href="/api/auth/logout"
                    className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign out
                  </Link>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2 mt-6">
                <div className="rounded-xl border border-border bg-muted/40 p-4">
                  <p className="text-xs text-muted-foreground">Account mode</p>
                  <p className="text-sm font-semibold text-foreground mt-1">{accountModeLabel}</p>
                  <p className="text-[11px] text-muted-foreground mt-1">{accountModeHint}</p>
                </div>
                <div className="rounded-xl border border-border bg-muted/40 p-4">
                  <p className="text-xs text-muted-foreground">Trades made</p>
                  <p className="text-sm font-semibold text-foreground mt-1">{tradeCount}</p>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    Each new trade adds one here.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-card border border-border p-5 space-y-4">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-semibold text-foreground">Security checklist</h3>
              </div>
              <div className="space-y-3">
                {[
                  "Email verified",
                  "Multi-factor authentication",
                  "Backup codes stored",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <CheckCircle2 className="w-3.5 h-3.5 text-profit" />
                    {item}
                  </div>
                ))}
              </div>
              <button className="w-full rounded-lg bg-primary/15 text-primary text-xs font-semibold py-2 hover:bg-primary/20 transition-colors">
                Review security
              </button>
            </div>
          </section>

          <section className="grid gap-5 md:grid-cols-2">
            <div className="rounded-2xl bg-card border border-border p-5 space-y-4">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-semibold text-foreground">Preferences</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Default market</span>
                  <span className="text-foreground font-medium">EUR/USD</span>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Risk mode</span>
                  <span className="text-foreground font-medium">Conservative</span>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Notifications</span>
                  <span className="text-foreground font-medium">On</span>
                </div>
              </div>
              <button className="w-full rounded-lg bg-muted text-foreground text-xs font-semibold py-2 hover:bg-muted/80 transition-colors">
                Update preferences
              </button>
            </div>

            <div className="rounded-2xl bg-card border border-border p-5 space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-semibold text-foreground">Learning plan</h3>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Your personalized roadmap is 42% complete. Keep the momentum with two new
                lessons and a market simulation.
              </p>
              <button className="w-full rounded-lg bg-primary/15 text-primary text-xs font-semibold py-2 hover:bg-primary/20 transition-colors">
                Continue learning
              </button>
            </div>
          </section>
        </main>
      </div>

      <HelpPanel open={helpOpen} onClose={() => setHelpOpen(false)} />
    </div>
  )
}
