"use client"

import { createContext, useContext, useState, useEffect, useCallback } from "react"
import type { Language } from "@/lib/language"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("es")

  useEffect(() => {
    try {
      const saved = localStorage.getItem("pancake_language") as Language | null
      if (saved) setLanguageState(saved)
    } catch (e) {
      // ignore
    }
  }, [])

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang)
    try {
      localStorage.setItem("pancake_language", lang)
    } catch (e) {
      // ignore
    }
  }, [])

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
