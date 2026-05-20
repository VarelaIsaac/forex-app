"use client"

import { useCallback, useEffect, useState } from "react"
import { useUser } from "@auth0/nextjs-auth0/client"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3001";

export function useLearning() {
  const { user } = useUser()
  const [progress, setProgress] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const fetchProgress = useCallback(async () => {
    if (!user) return
    setLoading(true)
    try {
      const email = (user as any).email
      const res = await fetch(`${API_BASE}/learning/progress/${encodeURIComponent(email)}`)
      if (!res.ok) {
        // Try by id
        const id = (user as any).id || (user as any).sub
        const r2 = await fetch(`${API_BASE}/learning/progress/${encodeURIComponent(id)}`)
        if (r2.ok) setProgress(await r2.json())
      } else {
        setProgress(await res.json())
      }
    } catch (err) {
      console.warn('fetchProgress error', err)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchProgress()
  }, [fetchProgress])

  const saveProgress = useCallback(
    async (lessonSlug: string, progressValue: number, completed: boolean) => {
      if (!user) return
      const email = (user as any).email
      await fetch(`${API_BASE}/learning/progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userEmail: email, lessonSlug, progress: progressValue, completed }),
      })
      // refresh local copy
      await fetchProgress()
    },
    [user, fetchProgress],
  )

  return { progress, loading, fetchProgress, saveProgress }
}
