import { THEME_PALETTES } from '../constants/themes'
import type { LanguageOption, StudioConfig, VisualTheme } from '../types'

interface ConfigPanelProps {
  isOpen: boolean
  onClose: () => void
  config: StudioConfig
  onChange: (config: StudioConfig) => void
}

export function ConfigPanel({ isOpen, onClose, config, onChange }: ConfigPanelProps) {
  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/70 px-4">
      <div className="glass-card w-full max-w-xl space-y-4 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">OpenAI Studio Settings</h2>
          <button type="button" className="text-sm text-slate-300 hover:text-white" onClick={onClose}>
            Close
          </button>
        </div>

        <label className="block space-y-2">
          <span className="text-sm text-slate-300">OpenAI API Key</span>
          <input
            type="password"
            value={config.apiKey}
            onChange={(event) => onChange({ ...config, apiKey: event.target.value.trim() })}
            className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 outline-none focus:border-sky-400"
            placeholder="sk-..."
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm text-slate-300">Slides Count ({config.slideCount})</span>
          <input
            type="range"
            min={6}
            max={15}
            value={config.slideCount}
            onChange={(event) => onChange({ ...config, slideCount: Number(event.target.value) })}
            className="w-full"
          />
        </label>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="block space-y-2">
            <span className="text-sm text-slate-300">Language</span>
            <select
              value={config.language}
              onChange={(event) =>
                onChange({
                  ...config,
                  language: event.target.value as LanguageOption,
                })
              }
              className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm text-slate-100"
            >
              <option value="en">English (LTR)</option>
              <option value="fr">Français (LTR)</option>
              <option value="ar">العربية (RTL)</option>
            </select>
          </label>

          <label className="block space-y-2">
            <span className="text-sm text-slate-300">Theme</span>
            <select
              value={config.theme}
              onChange={(event) =>
                onChange({
                  ...config,
                  theme: event.target.value as VisualTheme,
                })
              }
              className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm text-slate-100"
            >
              {Object.entries(THEME_PALETTES).map(([value, palette]) => (
                <option key={value} value={value}>
                  {palette.name}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>
    </div>
  )
}
