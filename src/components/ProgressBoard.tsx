import { Check, LoaderCircle } from 'lucide-react'
import type { ProgressEntry } from '../types'

interface ProgressBoardProps {
  items: ProgressEntry[]
  busy: boolean
}

export function ProgressBoard({ items, busy }: ProgressBoardProps) {
  if (items.length === 0) {
    return null
  }

  return (
    <div className="glass-card space-y-2 p-4">
      {items.map((item) => (
        <div key={item.id} className="flex items-center gap-3 text-sm text-slate-200">
          {item.done ? (
            <Check className="h-4 w-4 text-emerald-300" />
          ) : busy ? (
            <LoaderCircle className="h-4 w-4 animate-spin text-sky-300" />
          ) : (
            <div className="h-4 w-4 rounded-full border border-slate-600" />
          )}
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  )
}
