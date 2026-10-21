import type { LanguageOption } from '../types'

export const UI_COPY: Record<LanguageOption, Record<string, string>> = {
  en: {
    appTitle: 'AI Cinematic Presentation Studio',
    subtitle: 'Craft immersive, animated PowerPoint decks in minutes.',
    pdfMode: 'PDF → Cinematic PPTX',
    pptxMode: 'PPTX Enhancer & Animator',
    uploadPdf: 'Drop a PDF file or click to upload',
    uploadPptx: 'Drop a PPTX file or click to upload',
    redesign: 'AI Redesign + Cinematic Animation',
    direct: 'Direct Animation Injection',
    config: 'OpenAI & Studio Settings',
    generate: 'Generate Slide Drafts',
    export: 'Export Animated PPTX',
    preview: 'Interactive Preview & Inline Editing',
  },
  fr: {
    appTitle: 'Studio IA de Présentation Cinématique',
    subtitle: 'Créez des présentations PowerPoint animées en quelques minutes.',
    pdfMode: 'PDF → PPTX cinématique',
    pptxMode: 'Améliorateur & Animateur PPTX',
    uploadPdf: 'Déposez un PDF ou cliquez pour téléverser',
    uploadPptx: 'Déposez un PPTX ou cliquez pour téléverser',
    redesign: 'Refonte IA + animation cinématique',
    direct: 'Injection directe des animations',
    config: 'Paramètres OpenAI & Studio',
    generate: 'Générer des brouillons de slides',
    export: 'Exporter en PPTX animé',
    preview: 'Aperçu interactif et édition en ligne',
  },
  ar: {
    appTitle: 'استوديو العروض السينمائية بالذكاء الاصطناعي',
    subtitle: 'أنشئ عروض PowerPoint متحركة واحترافية خلال دقائق.',
    pdfMode: 'تحويل PDF إلى PPTX سينمائي',
    pptxMode: 'تحسين وتحريك ملفات PPTX',
    uploadPdf: 'اسحب ملف PDF أو اضغط للرفع',
    uploadPptx: 'اسحب ملف PPTX أو اضغط للرفع',
    redesign: 'إعادة تصميم بالذكاء + حركة سينمائية',
    direct: 'حقن الحركات مباشرة',
    config: 'إعدادات OpenAI والاستوديو',
    generate: 'توليد مسودات الشرائح',
    export: 'تصدير PPTX متحرك',
    preview: 'معاينة تفاعلية وتحرير مباشر',
  },
}

export const RTL_LANGUAGES: LanguageOption[] = ['ar']

export const isRtlLanguage = (language: LanguageOption): boolean => RTL_LANGUAGES.includes(language)
