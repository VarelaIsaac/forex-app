"use client"

import { useEffect, useState } from "react"
import { MapPin, AlertCircle } from "lucide-react"

export function LocationPermissionPrompt() {
  const [shown, setShown] = useState(false)

  useEffect(() => {
    // Check if geolocation is available
    if (!navigator.geolocation) {
      return
    }

    // Check if permission was already denied or granted
    if ("permissions" in navigator) {
      navigator.permissions.query({ name: "geolocation" }).then((result) => {
        if (result.state === "prompt") {
          setShown(true)
        }
      })
    } else {
      setShown(true)
    }
  }, [])

  if (!shown) {
    return null
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-card border border-border rounded-lg p-4 shadow-lg z-40">
      <div className="flex gap-3">
        <div className="flex-shrink-0">
          <MapPin className="w-5 h-5 text-primary mt-0.5" />
        </div>
        <div className="flex-1 space-y-2">
          <p className="font-medium text-sm text-foreground">
            Enable Location for Dynamic Language
          </p>
          <p className="text-xs text-muted-foreground">
            Allow Pancake to detect your location and automatically set the best language for your region. Your location data stays private and is only used for language selection.
          </p>
          <div className="flex gap-2 pt-2">
            <button
              onClick={() => setShown(false)}
              className="flex-1 px-3 py-1.5 text-xs font-medium rounded border border-muted/40 text-muted-foreground hover:bg-muted/40 transition-colors"
            >
              Skip
            </button>
            <button
              onClick={() => {
                navigator.geolocation.getCurrentPosition(
                  () => {
                    setShown(false)
                  },
                  () => {
                    // Permission denied, still close the prompt
                    setShown(false)
                  },
                )
              }}
              className="flex-1 px-3 py-1.5 text-xs font-medium rounded bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Allow Location
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
