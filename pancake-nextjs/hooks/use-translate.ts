import { useLanguage } from "@/contexts/language-context"
import { translations } from "@/lib/language"

export function useTranslate() {
  const { language } = useLanguage()

  const t = (key: string, fallback?: string): string => {
    const translated = translations[language]?.[key]
    if (translated) {
      return translated
    }
    // Fallback to Spanish
    const fallbackTranslation = translations.es[key]
    if (fallbackTranslation) {
      return fallbackTranslation
    }
    // Return the provided fallback or the key itself
    return fallback || key
  }

  return { t, language }
}
