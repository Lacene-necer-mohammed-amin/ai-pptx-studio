import JSZip from 'jszip'
import type { ParsedPptx, SlideDraft } from '../types'

const decodeXmlEntities = (value: string): string =>
  value
    .replaceAll('&amp;', '&')
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'")

const extractTextRuns = (xml: string): string[] =>
  [...xml.matchAll(/<a:t[^>]*>([\s\S]*?)<\/a:t>/g)]
    .map((entry) => decodeXmlEntities(entry[1].trim()))
    .filter(Boolean)

const toSlideDraft = (texts: string[], index: number, notes: string): SlideDraft => {
  const [title, ...rest] = texts
  return {
    id: `slide-${index + 1}`,
    title: title ?? `Slide ${index + 1}`,
    bullets: rest.length > 0 ? rest.slice(0, 7) : ['Content imported from source slide.'],
    notes: notes || undefined,
  }
}

export const parsePptxFile = async (file: File): Promise<ParsedPptx> => {
  const zip = await JSZip.loadAsync(await file.arrayBuffer())
  const slideEntries = Object.keys(zip.files)
    .filter((name) => /^ppt\/slides\/slide\d+\.xml$/.test(name))
    .sort((a, b) => {
      const first = Number.parseInt(a.match(/\d+/)?.[0] ?? '0', 10)
      const second = Number.parseInt(b.match(/\d+/)?.[0] ?? '0', 10)
      return first - second
    })

  const slides: SlideDraft[] = []
  for (const [index, entry] of slideEntries.entries()) {
    const xml = await zip.file(entry)?.async('string')
    if (!xml) {
      continue
    }

    const notePath = `ppt/notesSlides/notesSlide${index + 1}.xml`
    const noteXml = await zip.file(notePath)?.async('string')
    const noteText = noteXml ? extractTextRuns(noteXml).join(' ') : ''
    const textRuns = extractTextRuns(xml)

    slides.push(toSlideDraft(textRuns, index, noteText))
  }

  const fullText = slides
    .map((slide) => `${slide.title}\n${slide.bullets.join('\n')}${slide.notes ? `\nNotes: ${slide.notes}` : ''}`)
    .join('\n\n')

  return { slides, fullText }
}
