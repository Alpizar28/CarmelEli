import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getPostBySlug } from '../lib/cms'
import type { BlogPost, Lang } from '../types/cms'

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>()
  const { i18n } = useTranslation()
  const lang = (i18n.language ?? 'en') as Lang
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!slug) return
    getPostBySlug(slug)
      .then(data => {
        if (!data || data.status !== 'published') {
          setNotFound(true)
        } else {
          setPost(data)
        }
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <p className="text-[11px] tracking-[4px] uppercase text-secondary animate-pulse">Cargando…</p>
      </div>
    )
  }

  if (notFound || !post) {
    return (
      <div className="min-h-screen bg-bg flex flex-col items-center justify-center gap-4">
        <p className="text-ink/40 text-sm">Esta entrada no existe o no está publicada.</p>
        <Link to="/#blog" className="text-[10px] tracking-[2px] uppercase text-secondary hover:text-primary transition-colors">
          ← Volver al blog
        </Link>
      </div>
    )
  }

  // Use translated content for current language if available
  const tr = post.translations?.[lang]
  const displayTitle   = tr?.title   ?? post.title
  const displayExcerpt = tr?.excerpt ?? post.excerpt
  const displayContent = tr?.content ?? post.content

  return (
    <div className="min-h-screen bg-bg">
      {post.imageUrl && (
        <div
          className="w-full h-64 md:h-96 bg-cover bg-center"
          style={{ backgroundImage: `url(${post.imageUrl})` }}
        />
      )}

      <div className="max-w-2xl mx-auto px-6 py-16" dir={lang === 'he' ? 'rtl' : 'ltr'}>
        <Link
          to="/#blog"
          className="text-[10px] tracking-[2px] uppercase text-secondary hover:text-primary transition-colors mb-10 block"
        >
          ← Volver
        </Link>

        <p className="text-[10px] tracking-[2px] uppercase text-ink/30 mb-4">{post.publishedAt}</p>

        <h1
          className="font-display font-light text-primary mb-8 leading-tight"
          style={{ fontSize: 'clamp(32px, 5vw, 52px)' }}
        >
          {displayTitle}
        </h1>

        {displayExcerpt && (
          <p className="text-lg text-ink/60 leading-relaxed mb-10 italic font-display">
            {displayExcerpt}
          </p>
        )}

        <div className="border-t border-divider mb-10" />

        <div className="text-base text-ink/80 leading-relaxed whitespace-pre-wrap">
          {displayContent}
        </div>
      </div>
    </div>
  )
}
