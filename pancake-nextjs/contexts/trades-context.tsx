"use client"

import React, { createContext, useContext, useState, useCallback } from "react"

export interface Trade {
  id: string
  direction: "buy" | "sell"
  pair: string
  size: number
  entryPrice: number
  timestamp: Date
  status: "open" | "closed"
  exitPrice?: number
  profitLoss?: number
}

interface TradesContextType {
  trades: Trade[]
  balance: number
  initialBalance: number
  addTrade: (trade: Omit<Trade, "id" | "timestamp">) => void
  closeTrade: (id: string, exitPrice: number) => void
  getTotalProfit: () => number
  getWinRate: () => number
}

const TradesContext = createContext<TradesContextType | undefined>(undefined)

export function TradesProvider({ children }: { children: React.ReactNode }) {
  const INITIAL_BALANCE = 1000
  const [trades, setTrades] = useState<Trade[]>([])
  const [balance, setBalance] = useState(INITIAL_BALANCE)

  const addTrade = useCallback((trade: Omit<Trade, "id" | "timestamp">) => {
    const id = `trade-${Date.now()}`
    const newTrade: Trade = {
      ...trade,
      id,
      timestamp: new Date(),
    }
    setTrades((prev) => [newTrade, ...prev])

    // Deduct trade cost from balance (simplified: cost = size * entryPrice)
    const tradeCost = trade.size * trade.entryPrice
    setBalance((prev) => prev - tradeCost)
  }, [])

  const closeTrade = useCallback((id: string, exitPrice: number) => {
    setTrades((prev) =>
      prev.map((trade) => {
        if (trade.id === id) {
          const grossProfit = trade.direction === "buy"
            ? (exitPrice - trade.entryPrice) * trade.size * 10000
            : (trade.entryPrice - exitPrice) * trade.size * 10000

          return {
            ...trade,
            status: "closed",
            exitPrice,
            profitLoss: grossProfit,
          }
        }
        return trade
      })
    )

    // Update balance
    const closedTrade = trades.find((t) => t.id === id)
    if (closedTrade && closedTrade.profitLoss !== undefined) {
      setBalance((prev) => prev + closedTrade.profitLoss)
    }
  }, [trades])

  const getTotalProfit = useCallback(() => {
    return trades.reduce((sum, trade) => {
      if (trade.profitLoss !== undefined) {
        return sum + trade.profitLoss
      }
      return sum
    }, 0)
  }, [trades])

  const getWinRate = useCallback(() => {
    const closedTrades = trades.filter((t) => t.status === "closed")
    if (closedTrades.length === 0) return 0

    const wins = closedTrades.filter((t) => (t.profitLoss ?? 0) > 0).length
    return Math.round((wins / closedTrades.length) * 100)
  }, [trades])

  return (
    <TradesContext.Provider
      value={{
        trades,
        balance,
        initialBalance: INITIAL_BALANCE,
        addTrade,
        closeTrade,
        getTotalProfit,
        getWinRate,
      }}
    >
      {children}
    </TradesContext.Provider>
  )
}

export function useTrades() {
  const context = useContext(TradesContext)
  if (context === undefined) {
    throw new Error("useTrades must be used within a TradesProvider")
  }
  return context
}
