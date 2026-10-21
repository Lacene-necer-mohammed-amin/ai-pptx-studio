import { Settings, Sparkles } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { ConfigPanel } from './components/ConfigPanel'
import { FileDropZone } from './components/FileDropZone'
import { ModeTabs } from './components/ModeTabs'
import { PreviewCarousel } from './components/PreviewCarousel'
import { ProgressBoard } from './components/ProgressBoard'
import { generateCinematicPptx } from './services/pptxGenerator'
import { extractTextFromPdf } from './services/pdfExtractor'
import { injectCinematicAnimations } from './services/openXmlInjector'
import { structureSlidesWithAi } from './services/openaiService'
import { parsePptxFile } from './services/pptxParser'
import type {
  EnhancementMode,
  ProgressEntry,
  SlideDraft,
  StudioConfig,
  StudioMode,
} from './types'
import { getDirection } from './utils/direction'
import { UI_COPY } from './utils/i18n'

const CONFIG_STORAGE_KEY = 'ai-cinematic-studio-config'

const defaultConfig: StudioConfig = {
  apiKey: '',
  slideCount: 10,
  language: 'en',
  theme: 'cyber-dark',
}

const stepsForMode: Record<StudioMode, string[]> = {
  pdf: [
    'Extracting Document...',
    'AI Structuring Slides...',
    'Rendering Interactive Preview...',
  ],
  pptx: [
    'Parsing Source PPTX...',
    'Preparing Slide Narrative...',
    'Rendering Interactive Preview...',
  ],
}

function App() {
  const [mode, setMode] = useState<StudioMode>('pdf')
  const [enhancementMode, setEnhancementMode] = useState<EnhancementMode>('ai-redesign')
  const [config, setConfig] = useState<StudioConfig>(defaultConfig)
  const [showConfig, setShowConfig] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [slides, setSlides] = useState<SlideDraft[]>([])
  const [progress, setProgress] = useState<ProgressEntry[]>([])
  const [busy, setBusy] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const saved = localStorage.getItem(CONFIG_STORAGE_KEY)
    if (!saved) {
      return
    }

    try {
      const parsed = JSON.parse(saved) as StudioConfig
      setConfig(parsed)
    } catch {
      localStorage.removeItem(CONFIG_STORAGE_KEY)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(config))
  }, [config])

  const copy = UI_COPY[config.language]
  const textDirection = useMemo(() => getDirection(config.language, slides), [config.language, slides])

  const buildProgressBoard = (): ProgressEntry[] =>
    stepsForMode[mode].map((label, index) => ({
      id: `${mode}-${index}`,
      label,
      done: false,
    }))

  const markStepDone = (entries: ProgressEntry[], stepIndex: number): ProgressEntry[] =>
    entries.map((entry, index) =>
      index === stepIndex
        ? {
            ...entry,
            done: true,
          }
        : entry,
    )

  const handleGenerate = async () => {
    if (!uploadedFile) {
      setErrorMessage('Please upload a source file first.')
      return
    }

    if (!config.apiKey && (mode === 'pdf' || enhancementMode === 'ai-redesign')) {
      setErrorMessage('Please configure your OpenAI API key to continue.')
      return
    }

    setBusy(true)
    setErrorMessage('')
    let progressEntries = buildProgressBoard()
    setProgress(progressEntries)

    try {
      if (mode === 'pdf') {
        const extractedText = await extractTextFromPdf(uploadedFile)
        progressEntries = markStepDone(progressEntries, 0)
        setProgress(progressEntries)

        const aiSlides = await structureSlidesWithAi(extractedText, config, 'ai-redesign')
        progressEntries = markStepDone(progressEntries, 1)
        setProgress(progressEntries)
        setSlides(aiSlides)
      } else {
        const parsed = await parsePptxFile(uploadedFile)
        progressEntries = markStepDone(progressEntries, 0)
        setProgress(progressEntries)

        if (enhancementMode === 'ai-redesign') {
          const aiSlides = await structureSlidesWithAi(parsed.fullText, config, enhancementMode)
          setSlides(aiSlides)
        } else {
          setSlides(parsed.slides.slice(0, config.slideCount))
        }

        progressEntries = markStepDone(progressEntries, 1)
        setProgress(progressEntries)
      }

      progressEntries = markStepDone(progressEntries, 2)
      setProgress(progressEntries)
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to generate presentation content.')
    } finally {
      setBusy(false)
    }
  }

  const handleExport = async () => {
    if (slides.length === 0) {
      setErrorMessage('Generate and review slide drafts before exporting.')
      return
    }

    setBusy(true)
    setErrorMessage('')
    setProgress([
      { id: 'export-1', label: 'Building cinematic slide deck...', done: false },
      { id: 'export-2', label: 'Injecting Cinematic OpenXML Animations...', done: false },
      { id: 'export-3', label: 'Preparing download package...', done: false },
    ])

    try {
      const rawBuffer = await generateCinematicPptx(slides, config)
      setProgress((current) => markStepDone(current, 0))

      const enhancedBuffer = await injectCinematicAnimations(rawBuffer)
      setProgress((current) => markStepDone(current, 1))

      const blob = new Blob([enhancedBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      })
      const url = URL.createObjectURL(blob)
      const anchor = document.createElement('a')
      anchor.href = url
      anchor.download = `cinematic-studio-${Date.now()}.pptx`
      anchor.click()
      URL.revokeObjectURL(url)

      setProgress((current) => markStepDone(current, 2))
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to export animated PPTX.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="min-h-screen bg-cinematic px-4 py-8 text-slate-100 md:px-8" dir={textDirection}>
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <header className="glass-card flex flex-wrap items-center justify-between gap-4 p-5">
          <div>
            <h1 className="text-2xl font-bold text-white md:text-3xl">{copy.appTitle}</h1>
            <p className="mt-2 text-sm text-slate-300">{copy.subtitle}</p>
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950/50 px-4 py-2 text-sm text-slate-200 transition hover:border-sky-400"
            onClick={() => setShowConfig(true)}
          >
            <Settings className="h-4 w-4" />
            {copy.config}
          </button>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.15fr_1fr]">
          <div className="space-y-4">
            <ModeTabs
              mode={mode}
              onModeChange={setMode}
              pdfLabel={copy.pdfMode}
              pptxLabel={copy.pptxMode}
            />

            <FileDropZone
              accept={mode === 'pdf' ? '.pdf' : '.pptx'}
              label={mode === 'pdf' ? copy.uploadPdf : copy.uploadPptx}
              onFileSelected={setUploadedFile}
            />

            {mode === 'pptx' && (
              <div className="glass-card space-y-2 p-4">
                <p className="text-sm font-medium text-slate-100">PPTX Enhancement Mode</p>
                <label className="flex items-center gap-2 text-sm text-slate-300">
                  <input
                    type="radio"
                    checked={enhancementMode === 'ai-redesign'}
                    onChange={() => setEnhancementMode('ai-redesign')}
                  />
                  {copy.redesign}
                </label>
                <label className="flex items-center gap-2 text-sm text-slate-300">
                  <input
                    type="radio"
                    checked={enhancementMode === 'direct-animation'}
                    onChange={() => setEnhancementMode('direct-animation')}
                  />
                  {copy.direct}
                </label>
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                disabled={busy}
                className="inline-flex items-center gap-2 rounded-xl bg-sky-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-50"
                onClick={handleGenerate}
              >
                <Sparkles className="h-4 w-4" />
                {copy.generate}
              </button>

              <button
                type="button"
                disabled={busy || slides.length === 0}
                className="rounded-xl border border-emerald-500/50 bg-emerald-500/20 px-4 py-2 text-sm font-semibold text-emerald-200 transition hover:bg-emerald-500/30 disabled:cursor-not-allowed disabled:opacity-50"
                onClick={handleExport}
              >
                {copy.export}
              </button>
            </div>

            {uploadedFile && <p className="text-xs text-slate-400">Loaded: {uploadedFile.name}</p>}
            {errorMessage && <p className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-300">{errorMessage}</p>}

            <ProgressBoard items={progress} busy={busy} />
          </div>

          <div className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-300">{copy.preview}</h2>
            {slides.length > 0 ? (
              <PreviewCarousel slides={slides} onSlidesChange={setSlides} direction={textDirection} />
            ) : (
              <div className="glass-card p-6 text-sm text-slate-400">
                Generate slides to unlock the cinematic preview carousel.
              </div>
            )}
          </div>
        </section>
      </div>

      <ConfigPanel
        isOpen={showConfig}
        onClose={() => setShowConfig(false)}
        config={config}
        onChange={setConfig}
      />
    </div>
  )
}

export default App
