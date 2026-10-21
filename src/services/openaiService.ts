import type { EnhancementMode, LanguageOption, SlideDraft, StudioConfig } from '../types'

interface OpenAiResponse {
  choices?: Array<{
    message?: {
      content?: string
    }
  }>
  error?: {
    message?: string
  }
}

const schema = {
  name: 'cinematic_presentation',
  strict: true,
  schema: {
    type: 'object',
    additionalProperties: false,
    properties: {
      slides: {
        type: 'array',
        minItems: 6,
        maxItems: 15,
        items: {
          type: 'object',
          additionalProperties: false,
          properties: {
            title: { type: 'string' },
            bullets: {
              type: 'array',
              minItems: 3,
              maxItems: 6,
              items: { type: 'string' },
            },
            visualCue: { type: 'string' },
            notes: { type: 'string' },
          },
          required: ['title', 'bullets', 'visualCue', 'notes'],
        },
      },
    },
    required: ['slides'],
  },
} as const

const languageMap: Record<LanguageOption, string> = {
  en: 'English',
  fr: 'French',
  ar: 'Arabic',
}

export const structureSlidesWithAi = async (
  content: string,
  config: StudioConfig,
  enhancementMode: EnhancementMode,
): Promise<SlideDraft[]> => {
  const systemPrompt =
    enhancementMode === 'ai-redesign'
      ? 'You are a world-class cinematic presentation architect. Build compelling, logically progressive slides with concise text.'
      : 'You are a presentation animator assistant. Preserve source wording while optimizing hierarchy and readability.'

  const userPrompt = `Generate ${config.slideCount} presentation slides in ${languageMap[config.language]}.
Theme: ${config.theme}
Output concise titles and strategic bullets.
Content:\n${content.slice(0, 24000)}`

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + config.apiKey,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      temperature: 0.5,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      response_format: {
        type: 'json_schema',
        json_schema: schema,
      },
    }),
  })

  const payload = (await response.json()) as OpenAiResponse

  if (!response.ok) {
    throw new Error(payload.error?.message ?? 'OpenAI request failed')
  }

  const rawContent = payload.choices?.[0]?.message?.content
  if (!rawContent) {
    throw new Error('OpenAI returned an empty response.')
  }

  const cleanedContent = rawContent
    .replace(/^```json\s*/i, '')
    .replace(/```$/, '')
    .trim()

  const parsed = JSON.parse(cleanedContent) as {
    slides: Array<{ title: string; bullets: string[]; notes: string; visualCue: string }>
  }

  return parsed.slides.slice(0, config.slideCount).map((slide, index) => ({
    id: `ai-${index + 1}`,
    title: slide.title,
    bullets: slide.bullets,
    notes: slide.notes,
    visualCue: slide.visualCue,
  }))
}
