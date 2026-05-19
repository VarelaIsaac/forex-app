"use client"

import { useState } from "react"
import { AlertTriangle, CheckCircle2, HelpCircle, Info, Shield, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/hooks/use-notifications"
import { useTrades } from "@/contexts/trades-context"
import { cn } from "@/lib/utils"

interface QuickTradeProps {
  showTutorialHighlight?: boolean
}

const pairs = [
  { code: "EUR/USD", quote: "USD" },
  { code: "GBP/USD", quote: "USD" },
  { code: "USD/JPY", quote: "JPY" },
  { code: "AUD/USD", quote: "USD" },
]

function HintIcon({ text }: { text: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button className="text-muted-foreground/50 hover:text-primary transition-colors ml-1" aria-label="Más información">
          <HelpCircle className="w-3.5 h-3.5" />
        </button>
      </TooltipTrigger>
      <TooltipContent side="right" className="max-w-55 text-xs leading-relaxed">
        {text}
      </TooltipContent>
    </Tooltip>
  )
}

export function QuickTrade({ showTutorialHighlight }: QuickTradeProps) {
  const { success } = useToast()
  const { addTrade } = useTrades()
  const [pairCode, setPairCode] = useState("EUR/USD")
  const [amount, setAmount] = useState("0.01")
  const [showConfirm, setShowConfirm] = useState(false)
  const [pendingDirection, setPendingDirection] = useState<"buy" | "sell" | null>(null)
  const [confirming, setConfirming] = useState(false)

  const bid = 1.08390
  const ask = 1.08412
  const spread = ((ask - bid) * 10000).toFixed(1)
  
  const selectedPair = pairs.find(p => p.code === pairCode) || pairs[0]

  function handleTradeClick(direction: "buy" | "sell") {
    setPendingDirection(direction)
    setShowConfirm(true)
  }

  function confirmTrade() {
    setConfirming(true)
    // Simulate API call
    setTimeout(() => {
      const entryPrice = pendingDirection === "buy" ? ask : bid
      const tradeSize = parseFloat(amount)
      
      // Add trade to context
      addTrade({
        direction: pendingDirection as "buy" | "sell",
        pair: pairCode,
        size: tradeSize,
        entryPrice,
        status: "open",
      })

      success(`${pendingDirection === "buy" ? "Compra" : "Venta"} ejecutada`, {
        description: `${amount} lotes de ${pairCode} a ${entryPrice.toFixed(5)}. La operación se añadió a tu registro de aprendizaje.`
      })
      setShowConfirm(false)
      setPendingDirection(null)
      setConfirming(false)
    }, 800)
  }

  function cancelTrade() {
    setShowConfirm(false)
    setPendingDirection(null)
    setConfirming(false)
  }

  return (
    <TooltipProvider>
      <div 
        className={cn(
          "rounded-xl border border-border bg-card p-5 space-y-4 transition-all",
          showTutorialHighlight && "ring-2 ring-primary ring-offset-2 ring-offset-background"
        )}
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-sm font-semibold text-foreground">Realizar una operación</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Practica con dinero virtual</p>
          </div>
          <div className="flex items-center gap-1 bg-warning/10 border border-warning/25 rounded-full px-2 py-0.5">
            <Shield className="w-3 h-3 text-warning" />
            <span className="text-[10px] font-medium text-warning">Modo seguro</span>
          </div>
        </div>

        {/* Pair selector */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground flex items-center">
            Par de divisas
            <HintIcon text="Selecciona qué dos divisas quieres operar. EUR/USD significa comprar euros con dólares estadounidenses (o al revés)." />
          </label>
          <select
            aria-label="Par de divisas"
            value={pairCode}
            onChange={(e) => setPairCode(e.target.value)}
            className="w-full bg-muted border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {pairs.map((p) => <option key={p.code} value={p.code}>{p.code}</option>)}
          </select>
        </div>

        {/* Bid / Ask prices with currency display */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground flex items-center">
            Precios actuales <span className="ml-1 text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded">Cotización: {selectedPair.quote}</span>
            <HintIcon text="El precio de venta (bid) es lo que recibes al vender. El precio de compra (ask) es lo que pagas al comprar. La diferencia es el spread." />
          </label>
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-lg bg-loss/8 border border-loss/20 p-3 text-center">
              <p className="text-[10px] text-loss font-semibold uppercase tracking-wider">Precio de venta</p>
              <p className="text-lg font-bold tabular-nums text-foreground mt-1">{bid.toFixed(5)}</p>
              <p className="text-[10px] text-muted-foreground mt-1">{selectedPair.quote}</p>
            </div>
            <div className="rounded-lg bg-profit/8 border border-profit/20 p-3 text-center">
              <p className="text-[10px] text-profit font-semibold uppercase tracking-wider">Precio de compra</p>
              <p className="text-lg font-bold tabular-nums text-foreground mt-1">{ask.toFixed(5)}</p>
              <p className="text-[10px] text-muted-foreground mt-1">{selectedPair.quote}</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Spread: <span className="text-foreground font-medium">{spread} pips</span>
            <HintIcon text="El spread es la comisión del bróker. Cuanto más bajo, menores son los costes de operación. Los pares principales como EUR/USD suelen tener los spreads más bajos." />
          </p>
        </div>

        {/* Amount */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground flex items-center">
            Tamaño de la operación (lotes)
            <HintIcon text="El tamaño del lote indica cuánto estás operando. 0.01 = micro lote (el más seguro para aprender), 0.1 = mini lote, 1.0 = lote estándar. Empieza con 0.01." />
          </label>
          <input
            aria-label="Tamaño de la operación en lotes"
            type="number"
            value={amount}
            min="0.01"
            step="0.01"
            onChange={(e) => setAmount(e.target.value)}
            disabled={showConfirm}
            className="w-full bg-muted border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring tabular-nums disabled:opacity-50"
          />
          
          {/* Quick select buttons */}
          <div className="flex gap-1.5">
            {["0.01", "0.05", "0.1", "0.5"].map((v) => (
              <button
                key={v}
                onClick={() => setAmount(v)}
                disabled={showConfirm}
                className={cn(
                  "flex-1 rounded-lg py-2 text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
                  amount === v 
                    ? "bg-primary/20 text-primary border border-primary/30" 
                    : "bg-muted text-muted-foreground hover:text-foreground hover:bg-accent border border-transparent"
                )}
              >
                {v}
              </button>
            ))}
          </div>

          {/* Beginner recommendation */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 rounded-lg px-3 py-2">
            <Info className="w-3.5 h-3.5 text-primary shrink-0" />
            <span>
              <span className="text-primary font-medium">Recomendado:</span> Empieza con 0.01 lotes mientras aprendes.
            </span>
          </div>
        </div>

        {/* Buy / Sell buttons */}
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={() => handleTradeClick("sell")}
              disabled={showConfirm || confirming}
              className="h-12 bg-loss hover:bg-loss/90 text-foreground font-bold text-sm"
            >
              <span className="flex flex-col items-center">
                <span>VENDER</span>
                <span className="text-[10px] font-normal opacity-70">Ganas si el precio cae</span>
              </span>
            </Button>
            <Button
              onClick={() => handleTradeClick("buy")}
              disabled={showConfirm || confirming}
              className="h-12 bg-profit hover:bg-profit/90 text-foreground font-bold text-sm"
            >
              <span className="flex flex-col items-center">
                <span>COMPRAR</span>
                <span className="text-[10px] font-normal opacity-70">Ganas si el precio sube</span>
              </span>
            </Button>
          </div>
        </div>

        {/* Confirmation Modal Overlay */}
        {showConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-card border border-border rounded-xl shadow-xl max-w-sm w-full space-y-4 p-6 animate-in fade-in slide-in-from-bottom-4">
              {/* Header with close */}
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-lg font-semibold text-foreground">Confirma tu operación</h3>
                <button
                  onClick={cancelTrade}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Cerrar diálogo"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="space-y-4">
                {/* Warning */}
                <div className="flex items-start gap-3 rounded-lg bg-warning/10 border border-warning/25 p-4">
                  <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">Revisa antes de confirmar</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Estás a punto de <span className={cn("font-medium", pendingDirection === "buy" ? "text-profit" : "text-loss")}>
                        {pendingDirection === "buy" ? "COMPRAR" : "VENDER"}
                      </span> {amount} lots of {pairCode}.
                    </p>
                  </div>
                </div>

                {/* Trade details */}
                <div className="space-y-2 bg-muted/50 rounded-lg p-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Dirección:</span>
                    <span className={cn("font-medium", pendingDirection === "buy" ? "text-profit" : "text-loss")}>
                      {pendingDirection === "buy" ? "COMPRAR" : "VENDER"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Par:</span>
                    <span className="font-medium">{pairCode}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tamaño:</span>
                    <span className="font-medium">{amount} lotes</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Precio:</span>
                    <span className="font-medium">{pendingDirection === "buy" ? ask : bid}</span>
                  </div>
                </div>

                {/* Info */}
                <p className="text-xs text-muted-foreground bg-primary/5 rounded-lg p-3">
                  <span className="text-primary font-medium">💡 Consejo:</span> Este es un modo de práctica. No hay dinero real involucrado.
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-border">
                <Button
                  onClick={cancelTrade}
                  variant="outline"
                  className="flex-1"
                  disabled={confirming}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={confirmTrade}
                  disabled={confirming}
                  className={cn(
                    "flex-1",
                    pendingDirection === "buy" 
                      ? "bg-profit hover:bg-profit/90" 
                      : "bg-loss hover:bg-loss/90"
                  )}
                >
                  {confirming ? "Confirmando..." : "Confirmar"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  )
}
