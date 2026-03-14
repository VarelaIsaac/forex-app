"use client"

import { Bell, HelpCircle, Menu, Search, Settings } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface HeaderProps {
  onMenuClick: () => void
  onHelpClick: () => void
}

export function Header({ onMenuClick, onHelpClick }: HeaderProps) {
  return (
    <TooltipProvider>
      <header className="h-16 border-b border-border bg-card/60 backdrop-blur-sm flex items-center px-4 md:px-6 gap-4 shrink-0">
        {/* Mobile menu */}
        <button
          onClick={onMenuClick}
          className="xl:hidden text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Page title */}
        <div className="hidden md:block">
          <h1 className="text-sm font-semibold text-foreground">Dashboard</h1>
          <p className="text-xs text-muted-foreground">Welcome back, Jane</p>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-xs ml-auto md:ml-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search currency pairs..."
              className="w-full bg-muted border border-border rounded-lg pl-8 pr-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              aria-label="Search currency pairs"
            />
          </div>
        </div>

        <div className="flex items-center gap-1 ml-auto md:ml-0">
          {/* Live status */}
          <div className="hidden sm:flex items-center gap-1.5 bg-profit/10 border border-profit/25 rounded-full px-3 py-1 mr-2">
            <span className="w-1.5 h-1.5 rounded-full bg-profit animate-pulse" />
            <span className="text-xs font-medium text-profit">Markets Open</span>
          </div>

          {/* Practice mode indicator */}
          <div className="hidden lg:flex items-center gap-1.5 bg-warning/10 border border-warning/25 rounded-full px-3 py-1 mr-2">
            <span className="text-xs font-medium text-warning">Practice Mode</span>
          </div>

          {/* Help - prominent for beginners */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button 
                onClick={onHelpClick}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
              >
                <HelpCircle className="w-4 h-4" />
                <span className="sr-only">Help</span>
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p className="text-xs">Get help & tutorials</p>
            </TooltipContent>
          </Tooltip>

          {/* Notifications */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="relative w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
                <Bell className="w-4 h-4" />
                <Badge className="absolute -top-0.5 -right-0.5 w-4 h-4 p-0 text-[9px] flex items-center justify-center bg-primary border-background border-2">
                  3
                </Badge>
                <span className="sr-only">Notifications</span>
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p className="text-xs">3 new notifications</p>
            </TooltipContent>
          </Tooltip>

          {/* Settings */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
                <Settings className="w-4 h-4" />
                <span className="sr-only">Settings</span>
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p className="text-xs">Settings</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </header>
    </TooltipProvider>
  )
}
