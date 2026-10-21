import type { LanguageOption, SlideDraft } from '../types'
import { isRtlLanguage } from './i18n'

const ARABIC_REGEX = /[\u0600-\u06FF]/

export const getDirection = (language: LanguageOption, slides: SlideDraft[]): 'rtl' | 'ltr' => {
  if (isRtlLanguage(language)) {
    return 'rtl'
  }

  const combined = slides
    .flatMap((slide) => [slide.title, ...slide.bullets])
    .join(' ')
  return ARABIC_REGEX.test(combined) ? 'rtl' : 'ltr'
}
