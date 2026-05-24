import { Suspense } from "react"

import { MarketsClient } from "./markets-client"

export default function MarketsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen bg-background">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <MarketsClient />
    </Suspense>
  )
}
