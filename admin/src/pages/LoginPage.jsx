import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard', { replace: true })
  }, [isAuthenticated, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
    } catch {
      setError('Invalid credentials. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen grid place-items-center px-4 py-12 bg-slate-50 dark:bg-ink-950 overflow-hidden">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[520px] h-[520px] max-w-[90vw] rounded-full bg-violet-400/25 dark:bg-violet-500/15 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[420px] h-[420px] max-w-[90vw] rounded-full bg-indigo-400/15 dark:bg-indigo-500/10 blur-3xl" />
      </div>

      <div className="w-full max-w-sm">
        {import.meta.env.VITE_PUBLIC_URL && (
          <a
            href={import.meta.env.VITE_PUBLIC_URL}
            className="inline-flex items-center gap-2 text-xs text-slate-500 dark:text-zinc-500 hover:text-slate-700 dark:hover:text-zinc-300 transition-colors mb-6"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
            Back to portfolio
          </a>
        )}

        <div className="rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.02] backdrop-blur-xl p-7 sm:p-8 shadow-2xl shadow-slate-900/10 dark:shadow-black/40">
          <div className="text-center mb-7">
            <div className="inline-grid place-items-center w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 text-white text-xl font-bold mb-4 shadow-lg shadow-violet-500/30">
              N
            </div>
            <h1 className="text-xl font-semibold text-slate-900 dark:text-white tracking-tight mb-1">
              Admin Sign In
            </h1>
            <p className="text-sm text-slate-500 dark:text-zinc-500">
              Manage your portfolio content
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-xs font-medium text-slate-600 dark:text-zinc-400 mb-1.5">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="you@example.com"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-lg text-slate-900 dark:text-white text-sm placeholder:text-slate-400 dark:placeholder:text-zinc-600 focus:outline-none focus:border-violet-400 dark:focus:border-violet-400/50 focus:bg-white dark:focus:bg-white/[0.05] transition-all"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-medium text-slate-600 dark:text-zinc-400 mb-1.5">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-lg text-slate-900 dark:text-white text-sm placeholder:text-slate-400 dark:placeholder:text-zinc-600 focus:outline-none focus:border-violet-400 dark:focus:border-violet-400/50 focus:bg-white dark:focus:bg-white/[0.05] transition-all"
              />
            </div>

            {error && (
              <div className="px-3 py-2 rounded-lg bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-400/30 text-xs text-rose-700 dark:text-rose-300">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-gradient-to-br from-violet-500 to-indigo-500 text-white shadow-lg shadow-violet-500/20 hover:shadow-violet-500/40 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {loading ? (
                <>
                  <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" opacity="0.25" /><path d="M22 12a10 10 0 0 1-10 10" /></svg>
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7" /></svg>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
