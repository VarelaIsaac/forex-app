"use client"

import { BarChart2, BookOpen, Clock, Home, HelpCircle, TrendingUp, Wallet, X, Zap } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { useUser } from "@auth0/nextjs-auth0/client"
import { usePathname } from "next/navigation"
import { LanguageSelector } from "@/components/language-selector"
import { useTranslate } from "@/hooks/use-translate"

interface SidebarProps {
  open: boolean
  onClose: () => void
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const { user } = useUser()
  const pathname = usePathname()
  const { t } = useTranslate()

  const navItems = [
    { icon: Home, labelKey: "dashboard", href: "/", hint: "hint-dashboard" },
    { icon: TrendingUp, labelKey: "trade", href: "/trade", badge: "Nuevo", hint: "hint-trade" },
    { icon: BarChart2, labelKey: "markets", href: "/markets", hint: "hint-markets" },
    { icon: Clock, labelKey: "history", href: "/history", hint: "hint-history" },
    { icon: Wallet, labelKey: "wallet", href: "/wallet", hint: "hint-wallet" },
    { icon: BookOpen, labelKey: "learn", href: "/learn", badge: "5 lecciones", hint: "hint-learn" },
  ]

  const displayName = user?.name ?? user?.email ?? "Invitado"
  const initials = displayName
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()
  const avatarUrl = user?.picture ?? null
  return (
    <TooltipProvider>
      <>
        {/* Mobile overlay */}
        {open && (
          <div
            className="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm xl:hidden"
            onClick={onClose}
          />
        )}

        <aside
          className={cn(
            "fixed xl:relative z-40 xl:z-auto inset-y-0 left-0 flex flex-col w-48 bg-sidebar border-r border-sidebar-border shrink-0 transition-transform duration-200",
            open ? "translate-x-0" : "-translate-x-full xl:translate-x-0"
          )}
        >
          {/* Logo */}
          <div className="flex items-center justify-between px-3 h-14 border-b border-sidebar-border">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
                <Zap className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-bold text-sidebar-foreground tracking-tight text-base">Pancake</span>
            </div>
            <button
              onClick={onClose}
              className="xl:hidden text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Cerrar menú"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Demo mode banner */}
          <div className="mx-3 mt-3 rounded-lg bg-linear-to-br from-warning/15 to-warning/5 border border-warning/25 p-3">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2 h-2 rounded-full bg-warning animate-pulse" />
              <p className="text-sm font-semibold text-warning">{t("practice-mode")}</p>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {t("practice-mode-desc")}
            </p>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-2 py-3 space-y-1" aria-label="Main navigation">
            {navItems.map(({ icon: Icon, labelKey, href, badge, hint }) => (
              <Tooltip key={href}>
                <TooltipTrigger asChild>
                  <Link
                    href={href}
                    onClick={onClose}
                    className={cn(
                      "w-full flex items-center gap-3 px-2 py-2 rounded-lg text-sm font-medium transition-all",
                      pathname === href
                        ? "bg-primary/15 text-primary"
                        : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                    )}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="flex-1 text-left text-sm">{t(labelKey)}</span>
                    {badge && (
                      <Badge
                        variant="secondary"
                        className="text-[10px] px-1 py-0 h-5 bg-primary/20 text-primary border-0"
                      >
                        {badge}
                      </Badge>
                    )}
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p className="text-xs">{t(hint)}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </nav>

          {/* Language selector */}
          <div className="mx-3 mb-3">
            <LanguageSelector />
          </div>

          {/* Quick help removed per request */}

          {/* User profile */}
          <div className="p-4 border-t border-sidebar-border">
            <Link
              href="/profile"
              onClick={onClose}
              className="flex items-center gap-3 rounded-lg p-2 -m-2 hover:bg-sidebar-accent transition-colors"
              aria-label="Abrir perfil"
            >
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={displayName}
                  className="w-9 h-9 rounded-full object-cover shrink-0"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-bold shrink-0">
                  {initials}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-sidebar-foreground truncate">{displayName}</p>
                <p className="text-xs text-muted-foreground truncate flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-profit" />
                  {user?.email ?? t("beginner-trader")}
                </p>
              </div>
            </Link>
          </div>
        </aside>
      </>
    </TooltipProvider>
  )
}
