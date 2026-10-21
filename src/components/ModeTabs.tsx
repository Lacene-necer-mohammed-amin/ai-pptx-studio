import clsx from 'clsx'
import type { StudioMode } from '../types'

interface ModeTabsProps {
  mode: StudioMode
  onModeChange: (mode: StudioMode) => void
  pdfLabel: string
  pptxLabel: string
}

export function ModeTabs({ mode, onModeChange, pdfLabel, pptxLabel }: ModeTabsProps) {
  return (
    <div className="glass-card p-2 flex gap-2">
      {[
        { value: 'pdf', label: pdfLabel },
        { value: 'pptx', label: pptxLabel },
      ].map((item) => (
        <button
          key={item.value}
          type="button"
          className={clsx(
            'flex-1 rounded-xl px-4 py-3 text-sm font-semibold transition',
            mode === item.value
              ? 'bg-sky-500/80 text-white shadow-lg shadow-sky-950/40'
              : 'bg-slate-900/30 text-slate-300 hover:bg-slate-800/70',
          )}
          onClick={() => onModeChange(item.value as StudioMode)}
        >
          {item.label}
        </button>
      ))}
    </div>
  )
}
