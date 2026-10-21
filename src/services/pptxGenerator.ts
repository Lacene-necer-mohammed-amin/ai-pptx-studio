import PptxGenJS from 'pptxgenjs'
import { THEME_PALETTES } from '../constants/themes'
import type { LanguageOption, SlideDraft, StudioConfig } from '../types'

const fontByLanguage: Record<LanguageOption, string> = {
  en: 'Arial',
  fr: 'Arial',
  ar: 'Cairo',
}

const isRtl = (language: LanguageOption): boolean => language === 'ar'

export const generateCinematicPptx = async (
  slides: SlideDraft[],
  config: StudioConfig,
): Promise<ArrayBuffer> => {
  const pptx = new PptxGenJS()
  pptx.layout = 'LAYOUT_WIDE'
  pptx.author = 'AI Cinematic Presentation Studio'
  pptx.subject = 'Cinematic deck generated with AI'
  pptx.company = 'AI PPTX Studio'

  const palette = THEME_PALETTES[config.theme]
  const rtl = isRtl(config.language)
  const fontFace = fontByLanguage[config.language]

  slides.forEach((draft, index) => {
    const slide = pptx.addSlide()

    slide.background = {
      color: palette.background[index % 2],
    }

    slide.addShape(pptx.ShapeType.roundRect, {
      x: 0.1,
      y: 0.1,
      w: 13.13,
      h: 7.3,
      rectRadius: 0.15,
      fill: { color: palette.background[(index + 1) % 2], transparency: 8 },
      line: { color: palette.border, transparency: 65 },
      shadow: {
        type: 'outer',
        blur: 7,
        color: '000000',
        angle: 45,
        distance: 6,
        opacity: 0.22,
      },
      ...( { shapeName: '!!morph_card_bg' } as Record<string, string>),
    })

    slide.addShape(pptx.ShapeType.ellipse, {
      x: 10.4 - index * 0.08,
      y: -0.55 + index * 0.02,
      w: 4,
      h: 4,
      fill: { color: palette.accent, transparency: 80 },
      line: { color: palette.accent, transparency: 100 },
      ...( { shapeName: '!!morph_orb_1' } as Record<string, string>),
    })

    slide.addShape(pptx.ShapeType.ellipse, {
      x: -1 + index * 0.03,
      y: 4.4 - index * 0.04,
      w: 3.2,
      h: 3.2,
      fill: { color: palette.accent, transparency: 88 },
      line: { color: palette.accent, transparency: 100 },
      ...( { shapeName: '!!morph_orb_2' } as Record<string, string>),
    })

    slide.addShape(pptx.ShapeType.rect, {
      x: rtl ? 1.2 : 0.9,
      y: 0.8,
      w: 5,
      h: 0.08,
      fill: { color: palette.accent, transparency: 14 },
      line: { color: palette.accent, transparency: 100 },
      ...( { shapeName: '!!morph_accent_bar' } as Record<string, string>),
    })

    slide.addText(draft.title, {
      x: 0.9,
      y: 1.05,
      w: 11.5,
      h: 0.95,
      fontFace,
      fontSize: 28,
      bold: true,
      align: rtl ? 'right' : 'left',
      rtlMode: rtl,
      color: palette.text,
      valign: 'mid',
    })

    slide.addShape(pptx.ShapeType.roundRect, {
      x: 0.9,
      y: 2.05,
      w: 11.5,
      h: 4.35,
      rectRadius: 0.12,
      fill: { color: palette.card, transparency: 20 },
      line: { color: palette.border, transparency: 35 },
      shadow: {
        type: 'outer',
        blur: 4,
        color: '000000',
        angle: 45,
        distance: 3,
        opacity: 0.22,
      },
    })

    const bulletLines = draft.bullets.map((bullet) => `• ${bullet}`).join('\n')
    slide.addText(bulletLines, {
      x: 1.25,
      y: 2.4,
      w: 10.8,
      h: 3.6,
      fontFace,
      fontSize: 18,
      color: palette.muted,
      breakLine: true,
      align: rtl ? 'right' : 'left',
      rtlMode: rtl,
      valign: 'top',
      margin: 4,
      fit: 'shrink',
    })

    if (draft.visualCue) {
      slide.addText(draft.visualCue, {
        x: 1,
        y: 6.65,
        w: 11.2,
        h: 0.32,
        fontFace,
        italic: true,
        fontSize: 11,
        color: palette.accent,
        align: rtl ? 'right' : 'left',
        rtlMode: rtl,
      })
    }

    if (draft.notes) {
      slide.addNotes(draft.notes)
    }
  })

  const output = await pptx.write({ outputType: 'arraybuffer' })
  return output
}
