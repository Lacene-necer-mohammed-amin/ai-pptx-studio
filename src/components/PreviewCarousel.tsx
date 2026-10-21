import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useMemo, useState } from 'react'
import type { SlideDraft } from '../types'

interface PreviewCarouselProps {
  slides: SlideDraft[]
  onSlidesChange: (slides: SlideDraft[]) => void
  direction: 'rtl' | 'ltr'
}

export function PreviewCarousel({ slides, onSlidesChange, direction }: PreviewCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const activeSlide = slides[activeIndex]
  const indicator = useMemo(() => `${activeIndex + 1}/${slides.length}`, [activeIndex, slides.length])

  if (!activeSlide) {
    return null
  }

  return (
    <div className="glass-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-300">Preview</h3>
        <span className="text-xs text-slate-400">{indicator}</span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeSlide.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.35 }}
          className="space-y-4"
        >
          <input
            value={activeSlide.title}
            dir={direction}
            onChange={(event) => {
              const updatedSlides = slides.map((slide, index) =>
                index === activeIndex ? { ...slide, title: event.target.value } : slide,
              )
              onSlidesChange(updatedSlides)
            }}
            className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-lg font-semibold text-white outline-none focus:border-sky-400"
          />

          {activeSlide.bullets.map((bullet, bulletIndex) => (
            <textarea
              key={`${activeSlide.id}-${bulletIndex}`}
              value={bullet}
              dir={direction}
              onChange={(event) => {
                const updatedSlides = slides.map((slide, index) =>
                  index === activeIndex
                    ? {
                        ...slide,
                        bullets: slide.bullets.map((item, idx) =>
                          idx === bulletIndex ? event.target.value : item,
                        ),
                      }
                    : slide,
                )
                onSlidesChange(updatedSlides)
              }}
              rows={2}
              className="w-full resize-none rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2 text-sm text-slate-200 outline-none focus:border-sky-400"
            />
          ))}
        </motion.div>
      </AnimatePresence>

      <div className="mt-4 flex justify-between">
        <button
          type="button"
          className="rounded-lg border border-slate-700 px-3 py-2 text-xs text-slate-300 disabled:opacity-35"
          disabled={activeIndex === 0}
          onClick={() => setActiveIndex((current) => current - 1)}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <button
          type="button"
          className="rounded-lg border border-slate-700 px-3 py-2 text-xs text-slate-300 disabled:opacity-35"
          disabled={activeIndex === slides.length - 1}
          onClick={() => setActiveIndex((current) => current + 1)}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
