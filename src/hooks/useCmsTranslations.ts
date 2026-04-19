import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { subscribeSiteContentByLang } from '../lib/cms'

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

export function useCmsTranslations() {
  const { i18n } = useTranslation()

  useEffect(() => {
    const lang = normalizeLang(i18n.language ?? 'en')

    const unsubscribe = subscribeSiteContentByLang(lang, content => {
      const overrides: Record<string, unknown> = {}
      for (const [key, value] of Object.entries(content)) {
        const path = KEY_PATH_MAP[key]
        if (!path) continue
        setByPath(overrides, path, value)
      }
      i18n.addResourceBundle(lang, 'translation', overrides, true, true)
    })

    return unsubscribe
  }, [i18n, i18n.language])
}
