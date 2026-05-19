"use client"

import { Globe } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { languageLabels, type Language } from "@/lib/language"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const SUPPORTED: Language[] = ["en", "es"]

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage()

  return (
    <div className="flex items-center gap-3 p-2 bg-muted/40 rounded-lg border border-muted/60">
      <Globe className="w-4 h-4 text-muted-foreground" />
      <Select value={language} onValueChange={(value) => setLanguage(value as Language)}>
        <SelectTrigger className="w-32 h-8 text-xs border-0 bg-transparent">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {SUPPORTED.map((code) => (
            <SelectItem key={code} value={code}>
              {languageLabels[code]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
