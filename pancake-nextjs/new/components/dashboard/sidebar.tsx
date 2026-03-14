"use client"

import { BarChart2, BookOpen, Clock, Home, HelpCircle, TrendingUp, Wallet, X, Zap } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

const navItems = [
  { icon: Home, label: "Dashboard", active: true, hint: "Your main trading overview" },
  { icon: TrendingUp, label: "Trade", badge: "New", hint: "Open and manage trades" },
  { icon: BarChart2, label: "Markets", hint: "Browse all currency pairs" },
  { icon: Clock, label: "History", hint: "View your past trades" },
  { icon: Wallet, label: "Wallet", hint: "Manage your funds" },
  { icon: BookOpen, label: "Learn", badge: "5 lessons", hint: "Tutorials and guides" },
]

interface SidebarProps {
  open: boolean
  onClose: () => void
}

export function Sidebar({ open, onClose }: SidebarProps) {
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
            "fixed xl:relative z-40 xl:z-auto inset-y-0 left-0 flex flex-col w-64 bg-sidebar border-r border-sidebar-border shrink-0 transition-transform duration-200",
            open ? "translate-x-0" : "-translate-x-full xl:translate-x-0"
          )}
        >
          {/* Logo */}
          <div className="flex items-center justify-between px-5 h-16 border-b border-sidebar-border">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Zap className="w-4.5 h-4.5 text-primary-foreground" />
              </div>
              <span className="font-bold text-sidebar-foreground tracking-tight text-lg">ForexPro</span>
            </div>
            <button
              onClick={onClose}
              className="xl:hidden text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Demo mode banner */}
          <div className="mx-4 mt-4 rounded-xl bg-gradient-to-br from-warning/15 to-warning/5 border border-warning/25 p-4">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2 h-2 rounded-full bg-warning animate-pulse" />
              <p className="text-sm font-semibold text-warning">Practice Mode</p>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              You{"'"}re trading with <span className="text-foreground font-medium">$10,000</span> virtual money. 
              No real funds at risk — learn freely!
            </p>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-3 py-4 space-y-1" aria-label="Main navigation">
            {navItems.map(({ icon: Icon, label, active, badge, hint }) => (
              <Tooltip key={label}>
                <TooltipTrigger asChild>
                  <button
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                      active
                        ? "bg-primary/15 text-primary"
                        : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                    )}
                  >
                    <Icon className="w-4.5 h-4.5 shrink-0" />
                    <span className="flex-1 text-left">{label}</span>
                    {badge && (
                      <Badge
                        variant="secondary"
                        className="text-[10px] px-1.5 py-0 h-5 bg-primary/20 text-primary border-0"
                      >
                        {badge}
                      </Badge>
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p className="text-xs">{hint}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </nav>

          {/* Quick help */}
          <div className="mx-4 mb-4 rounded-xl bg-primary/8 border border-primary/20 p-4">
            <div className="flex items-center gap-2 mb-2">
              <HelpCircle className="w-4 h-4 text-primary" />
              <p className="text-xs font-semibold text-foreground">Need help?</p>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed mb-3">
              New to forex? Check out our beginner guides and tutorials.
            </p>
            <button className="w-full text-xs font-medium text-primary hover:text-primary/80 transition-colors text-left">
              View Learning Center →
            </button>
          </div>

          {/* User profile */}
          <div className="p-4 border-t border-sidebar-border">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-bold shrink-0">
                JD
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-sidebar-foreground truncate">Jane Doe</p>
                <p className="text-xs text-muted-foreground truncate flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-profit" />
                  Beginner trader
                </p>
              </div>
            </div>
          </div>
        </aside>
      </>
    </TooltipProvider>
  )
}
