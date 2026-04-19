import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getPosts, deletePost } from '../lib/cms'
import type { BlogPost } from '../types/cms'

export default function BlogList() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)

  async function load() {
    setLoading(true)
    const data = await getPosts(false)
    setPosts(data)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Delete "${title}"? This action cannot be undone.`)) return
    setDeleting(id)
    await deletePost(id)
    await load()
    setDeleting(null)
  }

  if (loading) {
    return (
      <div className="p-8">
        <p className="text-xs tracking-[4px] uppercase text-primary/80 animate-pulse">Loading posts...</p>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display font-light text-primary text-4xl mb-1">Blog Posts</h2>
          <p className="text-sm text-ink/75">{posts.length} post{posts.length !== 1 ? 's' : ''}</p>
        </div>
        <Link
          to="/admin/blog/new"
          className="text-xs tracking-[2px] uppercase px-5 py-2 bg-primary text-white hover:bg-primary/90 transition-colors"
        >
          + New post
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="bg-white border border-divider p-10 text-center">
          <p className="text-ink/70 text-base mb-4">No posts yet.</p>
          <Link
            to="/admin/blog/new"
            className="text-xs tracking-[2px] uppercase text-ink/80 hover:text-primary transition-colors"
          >
            Create first post
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {posts.map(post => (
            <div key={post.id} className="bg-white border border-divider p-4 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className="text-base font-medium text-ink truncate">{post.title}</h3>
                  <span className={`text-[10px] tracking-[2px] uppercase px-2 py-0.5 ${
                    post.status === 'published'
                      ? 'bg-primary/10 text-primary'
                      : 'bg-ink/5 text-ink/70'
                  }`}>
                    {post.status === 'published' ? 'Published' : 'Draft'}
                  </span>
                </div>
                <p className="text-sm text-ink/75 truncate">{post.excerpt}</p>
                <p className="text-xs text-ink/60 mt-0.5">{post.publishedAt}</p>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <Link
                  to={`/admin/blog/${post.id}`}
                  className="text-xs tracking-[2px] uppercase text-ink/80 hover:text-primary transition-colors"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(post.id, post.title)}
                  disabled={deleting === post.id}
                  className="text-xs tracking-[2px] uppercase text-red-500 hover:text-red-700 transition-colors disabled:opacity-40"
                >
                  {deleting === post.id ? '...' : 'Delete'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
