export type StudioMode = 'pdf' | 'pptx'

export type EnhancementMode = 'ai-redesign' | 'direct-animation'

export type LanguageOption = 'en' | 'fr' | 'ar'

export type VisualTheme =
  | 'cyber-dark'
  | 'royal-academic'
  | 'emerald-tech'
  | 'minimalist-executive'

export interface StudioConfig {
  apiKey: string
  slideCount: number
  language: LanguageOption
  theme: VisualTheme
}

export interface SlideDraft {
  id: string
  title: string
  bullets: string[]
  notes?: string
  visualCue?: string
}

export interface ParsedPptx {
  slides: SlideDraft[]
  fullText: string
}

export interface ProgressEntry {
  id: string
  label: string
  done: boolean
}
