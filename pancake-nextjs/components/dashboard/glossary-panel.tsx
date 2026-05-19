"use client"

import { useState } from "react"
import { BookOpen, ChevronDown, ChevronUp } from "lucide-react"

const terms = [
  {
    term: "Pip",
    def: "El movimiento más pequeño de precio en un par de divisas. En la mayoría de los pares, 1 pip = 0.0001. Piensa en ello como un céntimo de la divisa.",
  },
  {
    term: "Lote",
    def: "La unidad de medida de una operación. Estándar = 100,000 unidades, mini = 10,000, micro = 1,000. Los principiantes suelen operar micro lotes.",
  },
  {
    term: "Spread",
    def: "La diferencia entre el precio de compra (ask) y el de venta (bid). Así ganan dinero los brókers, como el margen de un cambio de divisas en el aeropuerto.",
  },
  {
    term: "Apalancamiento",
    def: "Pedir prestado al bróker para controlar una posición mayor. 1:100 significa que $100 controlan $10,000. Amplifica tanto las ganancias como las pérdidas.",
  },
  {
    term: "Margen",
    def: "El depósito necesario para abrir una operación apalancada. Si usas 1:100 para operar $10,000, solo necesitas $100 de margen.",
  },
  {
    term: "Stop Loss",
    def: "Una orden automática que cierra tu operación si el precio se mueve en tu contra una cantidad determinada. Úsala siempre para proteger tu cuenta.",
  },
  {
    term: "Take Profit",
    def: "Una orden automática que cierra tu operación cuando alcanza tu objetivo de beneficio. Bloquea las ganancias sin estar pendiente de la pantalla.",
  },
  {
    term: "Alcista / Bajista",
    def: "Mercado alcista = los precios suben. Mercado bajista = los precios caen. Los alcistas empujan hacia arriba y los bajistas hacia abajo.",
  },
]

export function GlossaryPanel() {
  const [expanded, setExpanded] = useState<string | null>(null)
  const [showAll, setShowAll] = useState(false)

  const visible = showAll ? terms : terms.slice(0, 4)

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 rounded-md bg-primary/15 flex items-center justify-center">
          <BookOpen className="w-3.5 h-3.5 text-primary" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-foreground">Glosario de Forex</h2>
          <p className="text-xs text-muted-foreground">Pulsa un término para saber más</p>
        </div>
      </div>

      <div className="space-y-1">
        {visible.map(({ term, def }) => {
          const isOpen = expanded === term
          return (
            <div key={term} className="rounded-lg overflow-hidden border border-border/50">
              <button
                onClick={() => setExpanded(isOpen ? null : term)}
                className="w-full flex items-center justify-between px-3 py-2.5 text-left hover:bg-accent/40 transition-colors"
              >
                <span className="text-xs font-medium text-foreground">{term}</span>
                {isOpen
                  ? <ChevronUp className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                  : <ChevronDown className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                }
              </button>
              {isOpen && (
                <div className="px-3 pb-3">
                  <p className="text-xs text-muted-foreground leading-relaxed">{def}</p>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <button
        onClick={() => setShowAll(!showAll)}
        className="mt-3 w-full text-xs text-primary hover:text-primary/80 font-medium transition-colors py-1"
      >
        {showAll ? "Mostrar menos términos" : `Mostrar ${terms.length - 4} términos más`}
      </button>
    </div>
  )
}
