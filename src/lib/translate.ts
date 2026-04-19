export type Lang = 'en' | 'es' | 'he'

const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_TRANSLATE_KEY as string | undefined

const TARGET_LANGS: Lang[] = ['en', 'es', 'he']

interface GoogleTranslateResponse {
  data: {
    translations: { translatedText: string }[]
  }
}

async function translateOne(text: string, target: Lang, source: Lang): Promise<string> {
  if (!GOOGLE_API_KEY) return text
  const url = `https://translation.googleapis.com/language/translate/v2?key=${GOOGLE_API_KEY}`
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ q: text, source, target, format: 'text' }),
  })
  if (!res.ok) return text
  const json = (await res.json()) as GoogleTranslateResponse
  return json.data.translations[0]?.translatedText ?? text
}

// Translates `text` written in `sourceLang` into all three languages.
// Returns { en, es, he } — sourceLang value is passed through unchanged.
export async function translateToAll(
  text: string,
  sourceLang: Lang,
): Promise<Record<Lang, string>> {
  const others = TARGET_LANGS.filter(l => l !== sourceLang)
  const [t1, t2] = await Promise.all(
    others.map(target => translateOne(text, target, sourceLang))
  )
  return {
    en: sourceLang === 'en' ? text : others[0] === 'en' ? t1 : t2,
    es: sourceLang === 'es' ? text : others[0] === 'es' ? t1 : t2,
    he: sourceLang === 'he' ? text : others[0] === 'he' ? t1 : t2,
  }
}
