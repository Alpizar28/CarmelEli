import { useEffect, useMemo, useRef, useState } from 'react'
import { I18nextProvider, initReactI18next } from 'react-i18next'
import { createInstance, type i18n as I18nInstance } from 'i18next'
import App from '../App'
import en from '../i18n/en.json'
import es from '../i18n/es.json'
import he from '../i18n/he.json'

type Lang = 'en' | 'es' | 'he'
type PreviewMode = 'content' | 'blog'

interface BlogPreviewDraft {
  title: string
  excerpt: string
  content: string
  imageUrl: string
  publishedAt: string
  lang: Lang
}

interface ContentUpdateMessage {
  type: 'content:update'
  lang: Lang
  values: Record<string, string>
  activeSection?: string
}

interface ContentFocusMessage {
  type: 'content:focus'
  activeSection: string
}

interface BlogUpdateMessage {
  type: 'blog:update'
  draft: BlogPreviewDraft
}

interface BlogPatchMessage {
  type: 'blog:patch'
  patch: Partial<Omit<BlogPreviewDraft, 'lang'>> & { lang: Lang }
}

type PreviewMessage = ContentUpdateMessage | ContentFocusMessage | BlogUpdateMessage | BlogPatchMessage

const BASE_TRANSLATIONS = { en, es, he }

const SECTION_SELECTORS: Record<string, string> = {
  hero: '#home',
  about: '#about',
  services: '#services',
  blog: '#blog',
  contact: '#contact',
  footer: 'footer',
}

const CONTENT_TO_I18N_KEY: Record<string, string> = {
  hero__tagline: 'hero.tagline',
  hero__title: 'hero.title',
  hero__subtitle: 'hero.subtitle',
  hero__quote: 'hero.quote',
  hero__cta: 'hero.cta',
  about__heading: 'about.heading',
  about__p1: 'about.p1',
  about__p2: 'about.p2',
  about__p3: 'about.p3',
  about__quote: 'about.quote',
  services__heading: 'services.heading',
  services__disclaimer: 'services.disclaimer',
  blog__heading: 'blog.heading',
  blog__intro: 'blog.intro',
  contact__heading: 'contact.heading',
  contact__intro: 'contact.intro',
  contact__note: 'contact.note',
  footer__copy: 'footer.copy',
}

function setByPath(target: Record<string, unknown>, path: string, value: string) {
  const parts = path.split('.')
  let current: Record<string, unknown> = target
  for (let i = 0; i < parts.length - 1; i += 1) {
    const key = parts[i]
    const next = current[key]
    if (!next || typeof next !== 'object' || Array.isArray(next)) {
      current[key] = {}
    }
    current = current[key] as Record<string, unknown>
  }
  current[parts[parts.length - 1]] = value
}

function cloneTranslations(lang: Lang): Record<string, unknown> {
  return JSON.parse(JSON.stringify(BASE_TRANSLATIONS[lang])) as Record<string, unknown>
}

function buildMergedTranslation(
  lang: Lang,
  draftByLang: Record<Lang, Record<string, string>>,
): Record<string, unknown> {
  const merged = cloneTranslations(lang)
  const draft = draftByLang[lang]
  for (const [contentKey, value] of Object.entries(draft)) {
    const i18nPath = CONTENT_TO_I18N_KEY[contentKey]
    if (!i18nPath) continue
    if (!value.trim()) continue
    setByPath(merged, i18nPath, value)
  }
  return merged
}

function highlightSection(section: string) {
  const selector = SECTION_SELECTORS[section]
  if (!selector) return
  const element = document.querySelector(selector) as HTMLElement | null
  if (!element) return

  element.scrollIntoView({ behavior: 'smooth', block: 'center' })
  element.classList.add('admin-preview-highlight')
  window.setTimeout(() => {
    element.classList.remove('admin-preview-highlight')
  }, 1200)
}

function createPreviewI18n(): I18nInstance {
  const instance = createInstance()
  instance.use(initReactI18next).init({
    resources: {
      en: { translation: cloneTranslations('en') },
      es: { translation: cloneTranslations('es') },
      he: { translation: cloneTranslations('he') },
    },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  })
  return instance
}

function BlogPreview({ draft }: { draft: BlogPreviewDraft }) {
  const direction = draft.lang === 'he' ? 'rtl' : 'ltr'

  return (
    <div className="min-h-screen bg-bg" dir={direction}>
      {draft.imageUrl ? (
        <div className="w-full h-64 md:h-96 bg-cover bg-center" style={{ backgroundImage: `url(${draft.imageUrl})` }} />
      ) : (
        <div
          className="w-full h-64 md:h-96"
          style={{ background: 'linear-gradient(135deg, #dde8e3 0%, #c9d8d2 100%)' }}
        />
      )}

      <div className="max-w-2xl mx-auto px-6 py-16">
        <p className="text-[10px] tracking-[2px] uppercase text-ink/45 mb-4">{draft.publishedAt || 'Draft date'}</p>

        <h1 className="font-display font-light text-primary mb-8 leading-tight" style={{ fontSize: 'clamp(32px, 5vw, 52px)' }}>
          {draft.title || 'Draft title'}
        </h1>

        {draft.excerpt ? (
          <p className="text-lg text-ink/70 leading-relaxed mb-10 italic font-display">{draft.excerpt}</p>
        ) : null}

        <div className="border-t border-divider mb-10" />

        <div className="text-base text-ink/85 leading-relaxed whitespace-pre-wrap">{draft.content || 'Draft content'}</div>
      </div>
    </div>
  )
}

export default function AdminPreviewPage() {
  const [mode, setMode] = useState<PreviewMode>('content')
  const [draftByLang, setDraftByLang] = useState<Record<Lang, Record<string, string>>>({ en: {}, es: {}, he: {} })
  const [previewLang, setPreviewLang] = useState<Lang>('en')
  const [blogDraft, setBlogDraft] = useState<BlogPreviewDraft>({
    title: '',
    excerpt: '',
    content: '',
    imageUrl: '',
    publishedAt: '',
    lang: 'en',
  })
  const i18nRef = useRef<I18nInstance | null>(null)

  if (!i18nRef.current) {
    i18nRef.current = createPreviewI18n()
  }

  const queryMode = useMemo(() => {
    const params = new URLSearchParams(window.location.search)
    const requested = params.get('mode')
    return requested === 'blog' ? 'blog' : 'content'
  }, [])

  useEffect(() => {
    setMode(queryMode)
  }, [queryMode])

  useEffect(() => {
    const instance = i18nRef.current
    if (!instance) return

    ;(['en', 'es', 'he'] as Lang[]).forEach(lang => {
      const merged = buildMergedTranslation(lang, draftByLang)
      instance.addResourceBundle(lang, 'translation', merged, true, true)
    })
    instance.changeLanguage(previewLang)
    document.documentElement.dir = previewLang === 'he' ? 'rtl' : 'ltr'
    document.documentElement.lang = previewLang
  }, [draftByLang, previewLang])

  useEffect(() => {
    const onMessage = (event: MessageEvent<PreviewMessage>) => {
      if (event.origin !== window.location.origin) return
      const payload = event.data
      if (!payload || typeof payload !== 'object') return

      if (payload.type === 'content:update') {
        setMode('content')
        setPreviewLang(payload.lang)
        setDraftByLang(prev => ({
          ...prev,
          [payload.lang]: { ...prev[payload.lang], ...payload.values },
        }))
        if (payload.activeSection) {
          highlightSection(payload.activeSection)
        }
        return
      }

      if (payload.type === 'content:focus') {
        setMode('content')
        highlightSection(payload.activeSection)
        return
      }

      if (payload.type === 'blog:update') {
        setMode('blog')
        setBlogDraft(payload.draft)
        setPreviewLang(payload.draft.lang)
        return
      }

      if (payload.type === 'blog:patch') {
        setMode('blog')
        setBlogDraft(prev => ({
          ...prev,
          ...payload.patch,
          lang: payload.patch.lang,
        }))
        setPreviewLang(payload.patch.lang)
      }
    }

    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [])

  return mode === 'blog'
    ? <BlogPreview draft={blogDraft} />
    : (
      <I18nextProvider i18n={i18nRef.current!}>
        <App />
      </I18nextProvider>
    )
}
