"use client"

import { useEffect, useRef, useState } from "react"

interface SpotlightOverlayProps {
  elementId?: string
  elementSelector?: string
  radius?: number
  opacity?: number
  onClose?: () => void
}

export function SpotlightOverlay({
  elementId,
  elementSelector,
  radius = 8,
  opacity = 0.7,
  onClose,
}: SpotlightOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    setIsReady(true)
  }, [])

  useEffect(() => {
    if (!isReady || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const updateSpotlight = () => {
      // Set canvas size to window size
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw semi-transparent overlay
      ctx.fillStyle = `rgba(0, 0, 0, ${opacity})`
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Find the target element
      const selector = elementSelector || (elementId ? `#${elementId}` : null)
      if (!selector) return

      const element = document.querySelector(selector)
      if (!element) return

      // Get element position and size
      const rect = element.getBoundingClientRect()
      const padding = radius

      // Create a circular spotlight cutout
      ctx.globalCompositeOperation = "destination-out"
      ctx.beginPath()
      ctx.arc(
        rect.left + rect.width / 2,
        rect.top + rect.height / 2,
        Math.max(rect.width, rect.height) / 2 + padding,
        0,
        Math.PI * 2,
      )
      ctx.fill()

      // Reset composite
      ctx.globalCompositeOperation = "source-over"
    }

    updateSpotlight()

    // Update on resize and scroll
    window.addEventListener("resize", updateSpotlight)
    window.addEventListener("scroll", updateSpotlight)

    return () => {
      window.removeEventListener("resize", updateSpotlight)
      window.removeEventListener("scroll", updateSpotlight)
    }
  }, [isReady, elementId, elementSelector, radius, opacity])

  return (
    <div className="fixed inset-0 pointer-events-none">
      <canvas ref={canvasRef} className="w-full h-full" />
      {onClose && (
        <button
          onClick={onClose}
          className="pointer-events-auto fixed bottom-4 right-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
        >
          Close Tutorial
        </button>
      )}
    </div>
  )
}
