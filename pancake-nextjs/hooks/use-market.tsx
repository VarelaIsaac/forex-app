"use client"

import { useEffect, useMemo, useState, useRef } from "react"
import { io, Socket } from "socket.io-client"

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:3001"

type Quote = { symbol: string; bid: number; ask: number }

export function useMarket() {
  const socketRef = useRef<Socket | null>(null)
  const [quotes, setQuotes] = useState<Record<string, Quote>>({})

  useEffect(() => {
    // Connect once
    const socket = io(WS_URL, { transports: ["websocket"] })
    socketRef.current = socket

    socket.on("connect", () => {
      console.log("[useMarket] connected", socket.id)
    })

    socket.on("price_update", (data: any[]) => {
      // data may be an array of objects with either { symbol, bid, ask } or { symbol, price }
      setQuotes(prev => {
        const next = { ...prev }
        data.forEach((raw) => {
          const symbol = raw.symbol || raw.symbol?.toString()
          if (!symbol) return

          if (raw.bid !== undefined && raw.ask !== undefined) {
            next[symbol] = { symbol, bid: raw.bid, ask: raw.ask }
          } else if (raw.price !== undefined) {
            // derive bid/ask from a single price (small synthetic spread)
            const price = Number(raw.price)
            const delta = price * 0.0002 // ~2 pips for typical FX rates
            next[symbol] = { symbol, bid: price - delta, ask: price + delta }
          } else {
            // unknown shape - ignore
          }
        })
        return next
      })
    })

    socket.on("disconnect", () => {
      console.log("[useMarket] disconnected")
    })

    return () => {
      socket.disconnect()
      socketRef.current = null
    }
  }, [])

  const subscribe = (pairs: string[]) => {
    if (!socketRef.current) return
    socketRef.current.emit("subscribe_prices", { pairs })
  }

  const unsubscribe = (pairs: string[]) => {
    if (!socketRef.current) return
    socketRef.current.emit("unsubscribe_prices", { pairs })
  }

  const get = (symbol: string) => quotes[symbol]

  return useMemo(() => ({ quotes, subscribe, unsubscribe, get }), [quotes])
}

export type { Quote }
