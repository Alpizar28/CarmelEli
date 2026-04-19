import { useState, useEffect, useMemo, useRef, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getPosts, createPost, updatePost } from '../lib/cms'
import { translateToAll, type Lang } from '../lib/translate'
import type { BlogPost, BlogPostDraft } from '../types/cms'
import LivePreviewFrame from './LivePreviewFrame'
import en from '../i18n/en.json'
import es from '../i18n/es.json'
import he from '../i18n/he.json'

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

const EMPTY: BlogPostDraft = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  imageUrl: '',
  publishedAt: new Date().toISOString().slice(0, 10),
  status: 'draft',
}

const LANG_LABELS: Record<Lang, string> = { en: 'English', he: 'Hebrew', es: 'Spanish' }
const SOURCE_LANGS: Lang[] = ['en', 'he']
const PREVIEW_ORIGIN = window.location.origin
const BLOG_PLACEHOLDERS = {
  en: en.blog.posts[0],
  es: es.blog.posts[0],
  he: he.blog.posts[0],
} as const

export default function BlogPostForm() {
  const { id } = useParams<{ id: string }>()
  const isNew = !id || id === 'new' || id === 'nuevo'
  const navigate = useNavigate()

  const [inputLang, setInputLang] = useState<Lang>('en')
  const isSourceLang = SOURCE_LANGS.includes(inputLang)
  const [form, setForm] = useState<BlogPostDraft>(EMPTY)
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [slugManual, setSlugManual] = useState(false)

  const iframeRef = useRef<HTMLIFrameElement>(null)
  const previewFrameRef = useRef<number | null>(null)
  const previewUrl = useMemo(() => '/admin/preview?mode=blog', [])

  const postBlogPreview = (draft: BlogPostDraft, lang: Lang) => {
    const target = iframeRef.current?.contentWindow
    if (!target) return
    target.postMessage(
      {
        type: 'blog:update',
        draft: {
          title: draft.title,
          excerpt: draft.excerpt,
          content: draft.content,
          imageUrl: draft.imageUrl,
          publishedAt: draft.publishedAt,
          lang,
        },
      },
      PREVIEW_ORIGIN,
    )
  }

  const queueBlogPatch = (patch: Partial<Omit<BlogPostDraft, 'translations'>> & { lang: Lang }) => {
    if (previewFrameRef.current !== null) {
      window.cancelAnimationFrame(previewFrameRef.current)
    }
    previewFrameRef.current = window.requestAnimationFrame(() => {
      previewFrameRef.current = null
      const target = iframeRef.current?.contentWindow
      if (!target) return
      target.postMessage(
        {
          type: 'blog:patch',
          patch,
        },
        PREVIEW_ORIGIN,
      )
    })
  }

  useEffect(() => {
    if (isNew) return
    getPosts(false).then((posts: BlogPost[]) => {
      const post = posts.find(p => p.id === id)
      if (post) {
        const { id: _id, createdAt: _createdAt, updatedAt: _updatedAt, ...draft } = post
        setForm(draft)
        setSlugManual(true)
        postBlogPreview(draft, inputLang)
      }
      setLoading(false)
    })
  }, [id, inputLang, isNew])

  useEffect(() => {
    return () => {
      if (previewFrameRef.current !== null) {
        window.cancelAnimationFrame(previewFrameRef.current)
      }
    }
  }, [])

  function handleTitleChange(value: string) {
    setForm(prev => {
      const next = {
        ...prev,
        title: value,
        slug: slugManual ? prev.slug : slugify(value),
      }
      queueBlogPatch({ title: next.title, slug: next.slug, lang: inputLang })
      return next
    })
  }

  function handleChange<K extends keyof BlogPostDraft>(key: K, value: BlogPostDraft[K]) {
    setForm(prev => {
      const next = { ...prev, [key]: value }
      queueBlogPatch({ [key]: value, lang: inputLang } as Partial<Omit<BlogPostDraft, 'translations'>> & { lang: Lang })
      return next
    })
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!form.title.trim() || !form.slug.trim()) {
      setError('Title and slug are required.')
      return
    }
    setSaving(true)
    setError('')
    try {
      let finalForm: BlogPostDraft

      if (isSourceLang) {
        const [titleTr, excerptTr, contentTr] = await Promise.all([
          translateToAll(form.title, inputLang),
          form.excerpt ? translateToAll(form.excerpt, inputLang) : Promise.resolve({ en: '', es: '', he: '' }),
          form.content ? translateToAll(form.content, inputLang) : Promise.resolve({ en: '', es: '', he: '' }),
        ])
        finalForm = {
          ...form,
          title: titleTr[inputLang],
          excerpt: excerptTr[inputLang],
          content: contentTr[inputLang],
          translations: {
            en: { title: titleTr.en, excerpt: excerptTr.en, content: contentTr.en },
            es: { title: titleTr.es, excerpt: excerptTr.es, content: contentTr.es },
            he: { title: titleTr.he, excerpt: excerptTr.he, content: contentTr.he },
          },
        }
      } else {
        const existing = form.translations ?? {}
        finalForm = {
          ...form,
          translations: {
            ...existing,
            [inputLang]: {
              title: form.title,
              excerpt: form.excerpt,
              content: form.content,
            },
          },
        }
      }

      if (isNew) {
        await createPost(finalForm)
      } else {
        await updatePost(id!, finalForm)
      }
      navigate('/admin/blog')
    } catch {
      setError('Save failed. Please try again.')
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        <p className="text-xs tracking-[4px] uppercase text-primary/80 animate-pulse">Loading...</p>
      </div>
    )
  }

  return (
    <div className="h-[calc(100vh-57px)] min-h-0 flex flex-col lg:flex-row">
      <div className="lg:basis-1/4 lg:max-w-[32rem] border-b lg:border-b-0 lg:border-r border-divider bg-bg/30">
        <div className="h-full overflow-auto p-6">
          <div className="mb-6">
            <h2 className="font-display font-light text-primary text-4xl mb-1">
              {isNew ? 'New Post' : 'Edit Post'}
            </h2>
            <p className="text-sm text-ink/85 mb-4">Fields marked with * are required.</p>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs tracking-[2px] uppercase text-ink/70">Language:</span>

              {SOURCE_LANGS.map(lang => (
                <button
                  key={lang}
                  type="button"
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
                type="button"
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

          <div className="sticky top-0 z-20 pt-3 pb-3 mb-5 bg-bg/95 backdrop-blur-sm border-y border-divider">
            {error ? <p className="text-red-500 text-sm mb-2">{error}</p> : null}
            <button
              type="submit"
              form="blog-post-form"
              disabled={saving}
              className="w-full text-sm tracking-[2px] uppercase px-6 py-4 bg-primary text-white hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {saving
                ? (isSourceLang ? 'Publishing and translating post...' : 'Publishing post...')
                : isNew ? 'Publish Post to Live Website' : 'Publish Post Update to Live Website'}
            </button>
          </div>

          <form id="blog-post-form" onSubmit={handleSubmit} className="space-y-5">
            <div className="bg-white border border-divider p-4">
              <label className="block text-[11px] tracking-[2px] uppercase text-ink/80 mb-2">Title *</label>
              <input
                type="text"
                value={form.title}
                onChange={e => handleTitleChange(e.target.value)}
                required
                dir={inputLang === 'he' ? 'rtl' : 'ltr'}
                placeholder={BLOG_PLACEHOLDERS[inputLang].title}
                className="w-full border border-divider px-3 py-2.5 text-base text-ink focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            <div className="bg-white border border-divider p-4">
              <label className="block text-[11px] tracking-[2px] uppercase text-ink/80 mb-2">
                Slug * <span className="normal-case text-ink/55">(post URL)</span>
              </label>
              <input
                type="text"
                value={form.slug}
                onChange={e => {
                  setSlugManual(true)
                  handleChange('slug', e.target.value)
                }}
                required
                placeholder="the-river-does-not-force"
                className="w-full border border-divider px-3 py-2.5 text-base text-ink font-mono focus:outline-none focus:border-primary transition-colors"
              />
              <p className="text-xs text-ink/65 mt-1">Auto-generated from title. You can edit it manually.</p>
            </div>

            <div className="bg-white border border-divider p-4">
              <label className="block text-[11px] tracking-[2px] uppercase text-ink/80 mb-2">Excerpt</label>
              <textarea
                value={form.excerpt}
                onChange={e => handleChange('excerpt', e.target.value)}
                rows={2}
                dir={inputLang === 'he' ? 'rtl' : 'ltr'}
                placeholder={BLOG_PLACEHOLDERS[inputLang].excerpt}
                className="w-full border border-divider px-3 py-2.5 text-base text-ink focus:outline-none focus:border-primary transition-colors resize-y"
              />
            </div>

            <div className="bg-white border border-divider p-4">
              <label className="block text-[11px] tracking-[2px] uppercase text-ink/80 mb-2">Content</label>
              <textarea
                value={form.content}
                onChange={e => handleChange('content', e.target.value)}
                rows={12}
                dir={inputLang === 'he' ? 'rtl' : 'ltr'}
                placeholder={inputLang === 'he' ? 'כתבי את התוכן המלא כאן…' : 'Write the full article content here...'}
                className="w-full border border-divider px-3 py-2.5 text-base text-ink focus:outline-none focus:border-primary transition-colors resize-y font-mono"
              />
            </div>

            <div className="bg-white border border-divider p-4">
              <label className="block text-[11px] tracking-[2px] uppercase text-ink/80 mb-2">Image URL</label>
              <input
                type="url"
                value={form.imageUrl}
                onChange={e => handleChange('imageUrl', e.target.value)}
                placeholder="https://..."
                className="w-full border border-divider px-3 py-2.5 text-base text-ink focus:outline-none focus:border-primary transition-colors"
              />
              {form.imageUrl && (
                <img
                  src={form.imageUrl}
                  alt="Preview"
                  className="mt-3 h-32 w-full object-cover border border-divider"
                  onError={e => {
                    ;(e.target as HTMLImageElement).style.display = 'none'
                  }}
                />
              )}
            </div>

            <div className="bg-white border border-divider p-4 grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] tracking-[2px] uppercase text-ink/80 mb-2">Publish date</label>
                <input
                  type="date"
                  value={form.publishedAt}
                  onChange={e => handleChange('publishedAt', e.target.value)}
                  className="w-full border border-divider px-3 py-2.5 text-base text-ink focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <div>
                <label className="block text-[11px] tracking-[2px] uppercase text-ink/80 mb-2">Status</label>
                <select
                  value={form.status}
                  onChange={e => handleChange('status', e.target.value as 'published' | 'draft')}
                  className="w-full border border-divider px-3 py-2.5 text-base text-ink focus:outline-none focus:border-primary transition-colors bg-white"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </div>

          </form>
        </div>
      </div>

      <div className="lg:basis-3/4 bg-white">
        <LivePreviewFrame
          title="Post Preview"
          iframeTitle="Live blog preview"
          iframeRef={iframeRef}
          src={previewUrl}
          onLoad={() => postBlogPreview(form, inputLang)}
        />
      </div>
    </div>
  )
}
