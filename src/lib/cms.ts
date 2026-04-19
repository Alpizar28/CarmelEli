import {
  collection, doc, getDocs, getDoc,
  addDoc, updateDoc, deleteDoc,
  query, where, orderBy, serverTimestamp, Timestamp, setDoc, onSnapshot,
} from 'firebase/firestore'
import { db } from './firebase'
import type { BlogPost, BlogPostDraft, SiteContent } from '../types/cms'

// ── helpers ──────────────────────────────────────────────────────────────────

function toIso(val: unknown): string {
  if (val instanceof Timestamp) return val.toDate().toISOString()
  if (typeof val === 'string') return val
  return new Date().toISOString()
}

function docToBlogPost(id: string, data: Record<string, unknown>): BlogPost {
  return {
    id,
    title:       String(data.title ?? ''),
    slug:        String(data.slug ?? ''),
    excerpt:     String(data.excerpt ?? ''),
    content:     String(data.content ?? ''),
    imageUrl:    String(data.imageUrl ?? ''),
    publishedAt: String(data.publishedAt ?? ''),
    status:      data.status === 'draft' ? 'draft' : 'published',
    createdAt:   toIso(data.createdAt),
    updatedAt:   toIso(data.updatedAt),
  }
}

// ── Blog Posts ────────────────────────────────────────────────────────────────

const POSTS = 'posts'

export async function getPosts(onlyPublished = false): Promise<BlogPost[]> {
  if (!db) return []
  const ref = collection(db, POSTS)
  const q = onlyPublished
    ? query(ref, where('status', '==', 'published'), orderBy('publishedAt', 'desc'))
    : query(ref, orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map(d => docToBlogPost(d.id, d.data() as Record<string, unknown>))
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  if (!db) return null
  const q = query(collection(db, POSTS), where('slug', '==', slug))
  const snap = await getDocs(q)
  if (snap.empty) return null
  const d = snap.docs[0]
  return docToBlogPost(d.id, d.data() as Record<string, unknown>)
}

export async function createPost(draft: BlogPostDraft): Promise<BlogPost> {
  if (!db) throw new Error('Firebase is not configured')
  const now = serverTimestamp()
  const ref = await addDoc(collection(db, POSTS), { ...draft, createdAt: now, updatedAt: now })
  const snap = await getDoc(ref)
  return docToBlogPost(snap.id, snap.data() as Record<string, unknown>)
}

export async function updatePost(id: string, data: Partial<BlogPostDraft>): Promise<void> {
  if (!db) throw new Error('Firebase is not configured')
  await updateDoc(doc(db, POSTS, id), { ...data, updatedAt: serverTimestamp() })
}

export async function deletePost(id: string): Promise<void> {
  if (!db) throw new Error('Firebase is not configured')
  await deleteDoc(doc(db, POSTS, id))
}

// ── Site Content ──────────────────────────────────────────────────────────────

const CONTENT = 'siteContent'

export async function getSiteContent(): Promise<SiteContent[]> {
  if (!db) return []
  const snap = await getDocs(collection(db, CONTENT))
  return snap.docs.map(d => ({ id: d.id, ...(d.data() as Omit<SiteContent, 'id'>) }))
}

export async function setSiteContent(section: string, key: string, value: string): Promise<void> {
  if (!db) throw new Error('Firebase is not configured')
  const id = `${section}__${key}`
  const ref = doc(db, CONTENT, id)
  await setDoc(ref, { section, key, value, updatedAt: new Date().toISOString() }, { merge: true })
}

// Saves one translated value per language as separate docs: section__key__en, etc.
export async function setSiteContentTranslations(
  section: string,
  key: string,
  translations: Record<string, string>,
): Promise<void> {
  if (!db) throw new Error('Firebase is not configured')
  const firestore = db
  const now = new Date().toISOString()
  await Promise.all(
    Object.entries(translations).map(([lang, value]) => {
      const id = `${section}__${key}__${lang}`
      return setDoc(
        doc(firestore, CONTENT, id),
        { section, key, lang, value, updatedAt: now },
        { merge: true },
      )
    })
  )
}

// Returns content map keyed by "section__key__lang" for multilingual content,
// and "section__key" for legacy single-lang content.
export async function getSiteContentByLang(lang: string): Promise<Record<string, string>> {
  if (!db) return {}
  const snap = await getDocs(collection(db, CONTENT))
  const translated: Record<string, string> = {}
  const legacy: Record<string, string> = {}
  for (const d of snap.docs) {
    const data = d.data() as Record<string, unknown>
    const docLang = data.lang as string | undefined
    const value = String(data.value ?? '')
    if (docLang === undefined) {
      legacy[d.id] = value
    } else if (docLang === lang) {
      const shortKey = `${data.section}__${data.key}`
      translated[shortKey] = value
    }
  }
  const result: Record<string, string> = {}
  for (const [key, value] of Object.entries(legacy)) {
    if (translated[key] !== undefined) continue
    result[key] = value
  }
  for (const [key, value] of Object.entries(translated)) {
    result[key] = value
  }
  return result
}

export function subscribeSiteContentByLang(
  lang: string,
  onChange: (content: Record<string, string>) => void,
): () => void {
  if (!db) {
    onChange({})
    return () => {}
  }
  const ref = collection(db, CONTENT)
  return onSnapshot(ref, snap => {
    const translated: Record<string, string> = {}
    const legacy: Record<string, string> = {}
    for (const d of snap.docs) {
      const data = d.data() as Record<string, unknown>
      const docLang = data.lang as string | undefined
      const value = String(data.value ?? '')
      if (docLang === undefined) {
        legacy[d.id] = value
      } else if (docLang === lang) {
        const shortKey = `${data.section}__${data.key}`
        translated[shortKey] = value
      }
    }
    const result: Record<string, string> = {}
    for (const [key, value] of Object.entries(legacy)) {
      if (translated[key] !== undefined) continue
      result[key] = value
    }
    for (const [key, value] of Object.entries(translated)) {
      result[key] = value
    }
    onChange(result)
  })
}
