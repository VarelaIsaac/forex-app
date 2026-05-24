"use client"

import { Auth0Provider } from "@auth0/nextjs-auth0/client"
import { TradesProvider } from "@/contexts/trades-context"
import { LanguageProvider } from "@/contexts/language-context"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { TutorialHost } from "@/components/tutorial/tutorial-host"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Auth0Provider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <LanguageProvider>
          <TradesProvider>
            {children}
            <TutorialHost />
            <Toaster />
          </TradesProvider>
        </LanguageProvider>
      </ThemeProvider>
    </Auth0Provider>
  )
}
