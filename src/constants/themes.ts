import type { VisualTheme } from '../types'

export interface ThemePalette {
  name: string
  background: [string, string]
  card: string
  border: string
  accent: string
  text: string
  muted: string
}

export const THEME_PALETTES: Record<VisualTheme, ThemePalette> = {
  'cyber-dark': {
    name: 'Cyber Dark',
    background: ['05070f', '111834'],
    card: '151b32',
    border: '2b3a77',
    accent: '67b3ff',
    text: 'f6f7ff',
    muted: 'b8c4ff',
  },
  'royal-academic': {
    name: 'Royal Academic',
    background: ['090b16', '2b1f4f'],
    card: '201b36',
    border: '58438c',
    accent: 'd3b4ff',
    text: 'f8f3ff',
    muted: 'd7c6ff',
  },
  'emerald-tech': {
    name: 'Emerald Tech',
    background: ['04140f', '0b2f26'],
    card: '112a24',
    border: '2f6e5f',
    accent: '53e3be',
    text: 'ecfffa',
    muted: 'a6d5ca',
  },
  'minimalist-executive': {
    name: 'Minimalist Executive',
    background: ['0d1117', '1a2230'],
    card: '1f2937',
    border: '3c475d',
    accent: '9fb8ff',
    text: 'f8fafc',
    muted: 'cbd5e1',
  },
}
