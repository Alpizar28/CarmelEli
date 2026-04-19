import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { getSiteContent, setSiteContentTranslations } from '../lib/cms'
import { translateToAll, type Lang } from '../lib/translate'
import type { SiteContent } from '../types/cms'
import LivePreviewFrame from './LivePreviewFrame'
import en from '../i18n/en.json'
import es from '../i18n/es.json'
import he from '../i18n/he.json'

const EDITABLE_FIELDS: { section: string; key: string; label: string; multiline?: boolean }[] = [
  { section: 'hero', key: 'tagline', label: 'Hero — Tagline' },
  { section: 'hero', key: 'title', label: 'Hero — Title' },
  { section: 'hero', key: 'subtitle', label: 'Hero — Subtitle' },
  { section: 'hero', key: 'quote', label: 'Hero — Quote', multiline: true },
  { section: 'hero', key: 'cta', label: 'Hero — Primary button' },
  { section: 'about', key: 'heading', label: 'About — Heading', multiline: true },
  { section: 'about', key: 'p1', label: 'About — Paragraph 1', multiline: true },
  { section: 'about', key: 'p2', label: 'About — Paragraph 2', multiline: true },
  { section: 'about', key: 'p3', label: 'About — Paragraph 3', multiline: true },
  { section: 'about', key: 'quote', label: 'About — Quote', multiline: true },
  { section: 'services', key: 'heading', label: 'Services — Heading' },
  { section: 'services', key: 'disclaimer', label: 'Services — Note', multiline: true },
  { section: 'blog', key: 'heading', label: 'Blog — Heading' },
  { section: 'blog', key: 'intro', label: 'Blog — Intro', multiline: true },
  { section: 'contact', key: 'heading', label: 'Contact — Heading' },
  { section: 'contact', key: 'intro', label: 'Contact — Intro', multiline: true },
  { section: 'contact', key: 'note', label: 'Contact — Note', multiline: true },
  { section: 'footer', key: 'copy', label: 'Footer — Copyright' },
]

interface FieldState {
  value: string
}

const LANG_LABELS: Record<Lang, string> = {
  en: 'English',
  he: 'Hebrew',
  es: 'Spanish',
}

// EN and HE are source languages — saving translates all 3.
// ES is correction-only — saving overwrites only ES, leaves EN/HE untouched.
const SOURCE_LANGS: Lang[] = ['en', 'he']

const PREVIEW_ORIGIN = window.location.origin

const I18N_PATH_BY_FIELD: Record<string, string> = {
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

const BASE_TRANSLATIONS = { en, es, he } as const

function readByPath(obj: Record<string, unknown>, path: string): string {
  const parts = path.split('.')
  let cursor: unknown = obj
  for (const part of parts) {
    if (!cursor || typeof cursor !== 'object' || Array.isArray(cursor)) return ''
    cursor = (cursor as Record<string, unknown>)[part]
  }
  return typeof cursor === 'string' ? cursor : ''
}

function getFieldPlaceholder(lang: Lang, id: string): string {
  const path = I18N_PATH_BY_FIELD[id]
  if (!path) return ''
  return readByPath(BASE_TRANSLATIONS[lang] as unknown as Record<string, unknown>, path)
}

export default function ContentEditor() {
  const [inputLang, setInputLang] = useState<Lang>('en')
  const [fields, setFields] = useState<Record<string, FieldState>>({})
  const [loading, setLoading] = useState(true)
  const [savingAll, setSavingAll] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [saveSuccess, setSaveSuccess] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const previewBufferRef = useRef<Record<string, string>>({})
  const previewFrameRef = useRef<number | null>(null)
  const previewValuesRef = useRef<Record<string, string>>({})

  const isSourceLang = SOURCE_LANGS.includes(inputLang)

  const previewUrl = useMemo(() => '/admin/preview?mode=content', [])

  const postPreviewMessage = useCallback((payload: unknown) => {
    const target = iframeRef.current?.contentWindow
    if (!target) return
    target.postMessage(payload, PREVIEW_ORIGIN)
  }, [])

  const flushPreviewBuffer = useCallback((activeSection?: string) => {
    const patch = previewBufferRef.current
    previewBufferRef.current = {}
    if (!Object.keys(patch).length) {
      if (activeSection) {
        postPreviewMessage({ type: 'content:focus', activeSection })
      }
      return
    }
    postPreviewMessage({
      type: 'content:update',
      lang: inputLang,
      values: patch,
      activeSection,
    })
  }, [inputLang, postPreviewMessage])

  const queuePreviewUpdate = useCallback((patch: Record<string, string>, activeSection?: string) => {
    previewBufferRef.current = { ...previewBufferRef.current, ...patch }
    if (previewFrameRef.current !== null) {
      if (activeSection) {
        postPreviewMessage({ type: 'content:focus', activeSection })
      }
      return
    }
    previewFrameRef.current = window.requestAnimationFrame(() => {
      previewFrameRef.current = null
      flushPreviewBuffer(activeSection)
    })
  }, [flushPreviewBuffer, postPreviewMessage])

  useEffect(() => {
    getSiteContent().then((items: SiteContent[]) => {
      // Build map keyed by "section__key__lang" and legacy "section__key"
      const map: Record<string, string> = {}
      for (const item of items) {
        map[item.id] = item.value
      }
      const initial: Record<string, FieldState> = {}
      const initialPreviewValues: Record<string, string> = {}
      for (const f of EDITABLE_FIELDS) {
        const langKey = `${f.section}__${f.key}__${inputLang}`
        const legacyKey = `${f.section}__${f.key}`
        const hasLangValue = Object.prototype.hasOwnProperty.call(map, langKey)
        const hasLegacyValue = Object.prototype.hasOwnProperty.call(map, legacyKey)
        const resolvedValue = map[langKey] ?? map[legacyKey] ?? ''
        initial[legacyKey] = {
          value: resolvedValue,
        }
        if (hasLangValue || hasLegacyValue) {
          initialPreviewValues[legacyKey] = resolvedValue
        }
      }
      setFields(initial)
      previewValuesRef.current = initialPreviewValues
      setLoading(false)
      postPreviewMessage({
        type: 'content:update',
        lang: inputLang,
        values: initialPreviewValues,
      })
    })
  }, [inputLang, postPreviewMessage])

  useEffect(() => {
    return () => {
      if (previewFrameRef.current !== null) {
        window.cancelAnimationFrame(previewFrameRef.current)
      }
    }
  }, [])

  const handleChange = useCallback((id: string, value: string) => {
    const [section] = id.split('__')
    setFields(prev => ({ ...prev, [id]: { ...prev[id], value } }))
    setSaveSuccess(false)
    setSaveError('')
    previewValuesRef.current = { ...previewValuesRef.current, [id]: value }
    queuePreviewUpdate({ [id]: value }, section)
  }, [queuePreviewUpdate])

  const handleSaveAll = useCallback(async () => {
    setSavingAll(true)
    setSaveError('')
    setSaveSuccess(false)
    try {
      if (isSourceLang) {
        await Promise.all(
          EDITABLE_FIELDS.map(async f => {
            const id = `${f.section}__${f.key}`
            const text = fields[id]?.value ?? ''
            const translations = await translateToAll(text, inputLang)
            await setSiteContentTranslations(f.section, f.key, translations)
          }),
        )
      } else {
        await Promise.all(
          EDITABLE_FIELDS.map(async f => {
            const id = `${f.section}__${f.key}`
            const text = fields[id]?.value ?? ''
            await setSiteContentTranslations(f.section, f.key, { [inputLang]: text })
          }),
        )
      }
      setSaveSuccess(true)
      setTimeout(() => {
        setSaveSuccess(false)
      }, 2500)
    } catch {
      setSaveError('Publish failed. Please try again.')
    } finally {
      setSavingAll(false)
    }
  }, [fields, inputLang, isSourceLang])

  if (loading) {
    return (
      <div className="p-8 h-full">
        <p className="text-xs tracking-[4px] uppercase text-primary/80 animate-pulse">Loading content...</p>
      </div>
    )
  }

  let currentSection = ''

  return (
    <div className="h-[calc(100vh-57px)] min-h-0 flex flex-col lg:flex-row">
      <div className="lg:basis-1/4 lg:max-w-[32rem] border-b lg:border-b-0 lg:border-r border-divider bg-bg/30">
        <div className="h-full overflow-auto px-6 py-6 space-y-4">
          <div className="mb-3">
            <h2 className="font-display font-light text-primary text-4xl mb-1">Content Editor</h2>
            <p className="text-sm text-ink/85 mb-5">
              Edit in your selected language. Source languages auto-translate on save.
            </p>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs tracking-[2px] uppercase text-ink/70">Language:</span>

              {SOURCE_LANGS.map(lang => (
                <button
                  key={lang}
                  onClick={() => setInputLang(lang)}
                  className={`text-xs tracking-[2px] uppercase px-3 py-1.5 border transition-colors ${
                    inputLang === lang
                      ? 'bg-primary text-white border-primary'
                      : 'border-divider text-ink/80 hover:border-primary hover:text-primary'
                  }`}
                >
                  {LANG_LABELS[lang]}
                </button>
              ))}

              <span className="text-divider text-sm">|</span>

              <button
                onClick={() => setInputLang('es')}
                className={`text-xs tracking-[2px] uppercase px-3 py-1.5 border transition-colors ${
                  inputLang === 'es'
                    ? 'bg-accent/80 text-ink border-accent'
                    : 'border-divider text-ink/80 hover:border-accent hover:text-ink'
                }`}
              >
                {LANG_LABELS.es}
              </button>

              <span className="text-[11px] text-ink/70 ml-1">
                {isSourceLang
                  ? `Auto-translates to ${(['en', 'es', 'he'] as Lang[]).filter(l => l !== inputLang).map(l => LANG_LABELS[l]).join(' + ')}`
                  : 'Correction mode: saves only this language'}
              </span>
            </div>
          </div>

          <div className="sticky top-0 z-20 pt-3 pb-3 bg-bg/95 backdrop-blur-sm border-y border-divider">
            {saveError ? <p className="text-sm text-red-600 mb-2">{saveError}</p> : null}
            {saveSuccess ? <p className="text-sm text-primary mb-2">Published successfully. Live site updated.</p> : null}
            <button
              onClick={handleSaveAll}
              disabled={savingAll}
              className="w-full text-sm tracking-[2px] uppercase px-6 py-4 bg-primary text-white hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {savingAll
                ? (isSourceLang ? 'Publishing and translating all sections...' : 'Publishing all sections...')
                : 'Publish Changes to Live Website'}
            </button>
          </div>

          {EDITABLE_FIELDS.map(f => {
            const id = `${f.section}__${f.key}`
            const state = fields[id] ?? { value: '' }
            const isNewSection = f.section !== currentSection
            if (isNewSection) currentSection = f.section

            return (
              <div key={id}>
                {isNewSection && (
                  <p className="text-[10px] tracking-[3px] uppercase text-ink/65 mt-6 mb-3 border-b border-divider pb-1">
                    {f.section}
                  </p>
                )}
                <div className="bg-white border border-divider p-4">
                  <label className="block text-[11px] tracking-[2px] uppercase text-ink/80 mb-2">
                    {f.label}
                  </label>
                  {f.multiline ? (
                    <textarea
                      value={state.value}
                      onFocus={() => postPreviewMessage({ type: 'content:focus', activeSection: f.section })}
                      onChange={e => handleChange(id, e.target.value)}
                      placeholder={getFieldPlaceholder(inputLang, id)}
                      rows={3}
                      dir={inputLang === 'he' ? 'rtl' : 'ltr'}
                      className="w-full border border-divider px-3 py-2.5 text-base text-ink focus:outline-none focus:border-primary transition-colors resize-y"
                    />
                  ) : (
                    <input
                      type="text"
                      value={state.value}
                      onFocus={() => postPreviewMessage({ type: 'content:focus', activeSection: f.section })}
                      onChange={e => handleChange(id, e.target.value)}
                      placeholder={getFieldPlaceholder(inputLang, id)}
                      dir={inputLang === 'he' ? 'rtl' : 'ltr'}
                      className="w-full border border-divider px-3 py-2.5 text-base text-ink focus:outline-none focus:border-primary transition-colors"
                    />
                  )}
                </div>
              </div>
            )
          })}

        </div>
      </div>

      <div className="lg:basis-3/4 bg-white">
        <LivePreviewFrame
          title="Page Preview"
          iframeTitle="Live preview"
          iframeRef={iframeRef}
          src={previewUrl}
          onLoad={() => {
            postPreviewMessage({
              type: 'content:update',
              lang: inputLang,
              values: previewValuesRef.current,
            })
          }}
        />
      </div>
    </div>
  )
}
