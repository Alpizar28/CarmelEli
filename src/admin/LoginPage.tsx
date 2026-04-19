import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

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

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/admin')
    } catch {
      setError('Invalid credentials. Please verify your email and password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <p className="text-xs tracking-[4px] uppercase text-primary/80 mb-2">Admin Panel</p>
          <h1 className="font-display font-light text-primary text-4xl">Carmel Eli</h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-white border border-divider p-8 space-y-5">
          <div>
            <label className="block text-xs tracking-[2px] uppercase text-ink/80 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full border border-divider px-4 py-2.5 text-base text-ink focus:outline-none focus:border-primary transition-colors"
              placeholder="you@email.com"
            />
          </div>

          <div>
            <label className="block text-xs tracking-[2px] uppercase text-ink/80 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full border border-divider px-4 py-2.5 text-base text-ink focus:outline-none focus:border-primary transition-colors"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-red-500 text-xs">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white text-xs tracking-[3px] uppercase py-3 hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}
