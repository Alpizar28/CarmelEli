import { useEffect } from 'react'
import { useNavigate, NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function AdminLayout() {
  const { user, loading, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && !user) navigate('/admin/login')
  }, [user, loading, navigate])

  useEffect(() => {
    const previousLang = document.documentElement.lang
    const previousDir = document.documentElement.dir
    document.documentElement.lang = 'en'
    document.documentElement.dir = 'ltr'
    return () => {
      document.documentElement.lang = previousLang
      document.documentElement.dir = previousDir
    }
  }, [])

  if (loading) {
    return (
        <div className="min-h-screen bg-bg flex items-center justify-center">
          <p className="text-xs tracking-[4px] uppercase text-primary/80 animate-pulse">Loading...</p>
        </div>
      )
  }

  if (!user) return null

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `block px-4 py-3 text-xs tracking-[2px] uppercase transition-colors ${
      isActive ? 'bg-primary text-white' : 'text-ink/85 hover:text-primary hover:bg-primary/5'
    }`

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      {/* Top bar */}
      <header className="bg-white border-b border-divider px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-display font-light text-primary text-xl">Carmel Eli</span>
          <span className="text-divider">|</span>
          <span className="text-[11px] tracking-[3px] uppercase text-primary/80">Admin</span>
        </div>
        <div className="flex items-center gap-6">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] tracking-[2px] uppercase text-ink/80 hover:text-primary transition-colors"
          >
            View site ↗
          </a>
          <button
            onClick={logout}
            className="text-[11px] tracking-[2px] uppercase text-ink/70 hover:text-primary transition-colors"
          >
            Sign out
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar nav */}
        <nav className="w-48 bg-white border-r border-divider flex-shrink-0 pt-6">
          <p className="px-4 mb-2 text-[10px] tracking-[3px] uppercase text-ink/55">Content</p>
          <NavLink to="/admin/content" className={linkClass}>Sections</NavLink>
          <p className="px-4 mt-5 mb-2 text-[10px] tracking-[3px] uppercase text-ink/55">Blog</p>
          <NavLink to="/admin/blog" end className={linkClass}>Posts</NavLink>
          <NavLink to="/admin/blog/new" className={linkClass}>New post</NavLink>
        </nav>

        {/* Content area */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
