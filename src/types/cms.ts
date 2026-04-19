export type Lang = 'en' | 'es' | 'he'

export interface BlogTranslation {
  title: string
  excerpt: string
  content: string
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  imageUrl: string
  publishedAt: string // ISO 8601: "2026-04-18"
  status: 'published' | 'draft'
  createdAt: string  // ISO 8601: "2026-04-18T10:00:00Z"
  updatedAt: string
  translations?: Partial<Record<Lang, BlogTranslation>>
}

export interface SiteContent {
  id: string
  section: string
  key: string
  value: string
  lang?: string
  updatedAt: string
}

export type BlogPostDraft = Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>
