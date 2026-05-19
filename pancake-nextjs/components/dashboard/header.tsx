"use client"

import { Bell, HelpCircle, Menu, Search, Moon, SunMedium } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useUser } from "@auth0/nextjs-auth0/client"
import { useTheme } from "next-themes"
import { useToast } from "@/hooks/use-notifications"
import { useTranslate } from "@/hooks/use-translate"
import { languageLabels } from "@/lib/language"

interface HeaderProps {
  onMenuClick: () => void
  onHelpClick: () => void
  title?: string
  subtitle?: string
}

export function Header({ onMenuClick, onHelpClick, title, subtitle }: HeaderProps) {
  const { user } = useUser()
  const { info } = useToast()
  const { t, language } = useTranslate()
  const { resolvedTheme, setTheme } = useTheme()
  const firstName = user?.name?.split(" ")[0] ?? user?.email ?? "there"
  const resolvedTitle = title ?? t("dashboard")
  const resolvedSubtitle = subtitle ?? `${t("welcome-back")}${firstName}`
  const isDarkMode = (resolvedTheme ?? "dark") === "dark"

  const handleSearchDisabled = () => {
    info(t("search-coming-soon-title"), {
      description: t("search-coming-soon-desc"),
    })
  }

  const handleThemeToggle = () => {
    setTheme(isDarkMode ? "light" : "dark")
  }

  const handleNotificationsClick = () => {
    info(t("notifications-coming-soon-title"), {
      description: t("notifications-coming-soon-desc"),
    })
  }

  return (
    <TooltipProvider>
      <header className="h-14 border-b border-border bg-card/60 backdrop-blur-sm flex items-center px-3 md:px-4 gap-3 shrink-0">
        {/* Mobile menu */}
        <button
          onClick={onMenuClick}
          className="xl:hidden text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Abrir menú"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Page title */}
        <div className="hidden md:block">
          <h1 className="text-sm font-semibold text-foreground">{resolvedTitle}</h1>
          <p className="text-[11px] text-muted-foreground">{resolvedSubtitle}</p>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-xs ml-auto md:ml-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <button
              type="button"
              onClick={handleSearchDisabled}
              disabled
              placeholder={t("search-placeholder")}
              className="w-full bg-muted/50 border border-border rounded-lg pl-8 pr-3 py-1.5 text-xs text-muted-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 opacity-50 cursor-not-allowed"
              aria-label="Search currency pairs (coming soon)"
              title={t("search-placeholder")}
            >
              <span className="text-left">{t("search-placeholder")}</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-1 ml-auto md:ml-0">
          {/* Live status */}
          <div className="hidden sm:flex items-center gap-1.5 bg-profit/10 border border-profit/25 rounded-full px-3 py-1 mr-2">
            <span className="w-1.5 h-1.5 rounded-full bg-profit animate-pulse" />
            <span className="text-xs font-medium text-profit">{t("markets-open")}</span>
          </div>

          {/* Practice mode indicator */}
          <div className="hidden lg:flex items-center gap-1.5 bg-warning/10 border border-warning/25 rounded-full px-3 py-1 mr-2">
            <span className="text-xs font-medium text-warning">{t("practice-mode")}</span>
          </div>

          {/* Language indicator */}
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="hidden sm:flex items-center gap-1.5 bg-primary/10 border border-primary/25 rounded-full px-2 py-1 mr-1">
                <span className="text-xs font-medium text-primary">{languageLabels[language]}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p className="text-xs">{t("language-tooltip")}</p>
            </TooltipContent>
          </Tooltip>

          {/* Help - prominent for beginners */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button 
                onClick={onHelpClick}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
              >
                <HelpCircle className="w-4 h-4" />
                <span className="sr-only">Ayuda</span>
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p className="text-xs">{t("help-tooltip")}</p>
            </TooltipContent>
          </Tooltip>

          {/* Notifications removed per request */}

          {/* Theme toggle */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button 
                onClick={handleThemeToggle}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                aria-label={isDarkMode ? t("switch-to-light") : t("switch-to-dark")}
              >
                {isDarkMode ? <SunMedium className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                <span className="sr-only">{isDarkMode ? t("switch-to-light") : t("switch-to-dark")}</span>
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p className="text-xs">{isDarkMode ? t("switch-to-light") : t("switch-to-dark")}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </header>
    </TooltipProvider>
  )
}
