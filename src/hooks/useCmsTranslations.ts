import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { subscribeSiteContentByLang } from '../lib/cms'
import en from '../i18n/en.json'
import es from '../i18n/es.json'
import he from '../i18n/he.json'

type Lang = 'en' | 'es' | 'he'

const KEY_PATH_MAP: Record<string, string> = {
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

const BASE_TRANSLATIONS = { en, es, he }
const mergedCache: Record<Lang, Record<string, unknown>> = {
  en: cloneBaseStatic('en'),
  es: cloneBaseStatic('es'),
  he: cloneBaseStatic('he'),
}

function cloneBaseStatic(lang: Lang): Record<string, unknown> {
  return JSON.parse(JSON.stringify(BASE_TRANSLATIONS[lang])) as Record<string, unknown>
}

function normalizeLang(raw: string): Lang {
  if (raw.startsWith('es')) return 'es'
  if (raw.startsWith('he')) return 'he'
  return 'en'
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

function cloneBase(lang: Lang): Record<string, unknown> {
  return cloneBaseStatic(lang)
}

export function useCmsTranslations() {
  const { i18n } = useTranslation()

  useEffect(() => {
    const hasFirebaseConfig =
      Boolean(import.meta.env.VITE_FIREBASE_API_KEY) &&
      Boolean(import.meta.env.VITE_FIREBASE_PROJECT_ID) &&
      Boolean(import.meta.env.VITE_FIREBASE_APP_ID)

    if (!hasFirebaseConfig) {
      return
    }

    const lang = normalizeLang(i18n.language ?? 'en')

    i18n.addResourceBundle(lang, 'translation', mergedCache[lang], true, true)

    try {
      const unsubscribe = subscribeSiteContentByLang(lang, content => {
        const merged = cloneBase(lang)
        for (const [key, value] of Object.entries(content)) {
          const path = KEY_PATH_MAP[key]
          if (!path) continue
          if (!value.trim()) continue
          setByPath(merged, path, value)
        }
        mergedCache[lang] = merged
        i18n.addResourceBundle(lang, 'translation', merged, true, true)
      })

      return unsubscribe
    } catch {
      return
    }
  }, [i18n, i18n.language])
}
