import { useEffect, useState, useCallback } from 'react'
import { getSiteContent, setSiteContent } from '../lib/cms'
import type { SiteContent } from '../types/cms'

interface UseSiteContentReturn {
  content: Record<string, string>
  loading: boolean
  set: (section: string, key: string, value: string) => Promise<void>
}

// In-memory cache so multiple components don't re-fetch independently
let cache: Record<string, string> | null = null
let cachePromise: Promise<void> | null = null

export function useSiteContent(): UseSiteContentReturn {
  const [content, setContent] = useState<Record<string, string>>(cache ?? {})
  const [loading, setLoading] = useState(cache === null)

  useEffect(() => {
    if (cache !== null) return

    if (!cachePromise) {
      cachePromise = getSiteContent().then((items: SiteContent[]) => {
        cache = {}
        for (const item of items) {
          cache[`${item.section}__${item.key}`] = item.value
        }
      })
    }

    cachePromise.then(() => {
      setContent(cache!)
      setLoading(false)
    })
  }, [])

  const set = useCallback(async (section: string, key: string, value: string) => {
    await setSiteContent(section, key, value)
    cache = { ...(cache ?? {}), [`${section}__${key}`]: value }
    setContent({ ...cache })
  }, [])

  return { content, loading, set }
}
