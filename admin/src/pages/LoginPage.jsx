import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { LayoutGrid, Image, FileText, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

const FEATURES = [
  { icon: LayoutGrid, label: 'Kelola section, skill, dan proyek' },
  { icon: Image, label: 'Atur hero, sertifikat & kontak' },
  { icon: FileText, label: 'Susun layanan dan perjalanan karier' },
]

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
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
    } catch (err) {
      const status = err.response?.status
      const data = err.response?.data
      if (status === 422 && data?.errors) {
        setError(Object.values(data.errors).flat()[0] || 'Validasi gagal.')
      } else if (status === 401) {
        setError('Email atau password salah.')
      } else {
        setError(data?.message || 'Terjadi kesalahan. Coba lagi.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login">
      <div className="login-aside">
        <span className="glow g1" />
        <span className="glow g2" />

        <div className="login-brand">
          <span className="sb-mark">N</span>
          <div>
            <div className="t" style={{ fontFamily: 'var(--font-display)', fontWeight: 600, color: 'var(--text)' }}>Naufal CMS</div>
            <div className="s" style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--muted)' }}>Portfolio Admin</div>
          </div>
        </div>

        <div className="login-hero">
          <h1>Kelola portfolio Anda<br />dari satu <span className="accent">panel</span>.</h1>
          <p>Perbarui konten, atur urutan section, dan kelola seluruh data portfolio dengan mudah dan cepat.</p>
          <div className="login-feats">
            {FEATURES.map((f, i) => {
              const Icon = f.icon
              return (
                <div className="login-feat" key={i}>
                  <span className="fi"><Icon /></span>
                  {f.label}
                </div>
              )
            })}
          </div>
        </div>

        <div className="login-foot">© {new Date().getFullYear()} Naufal Ma'ruf Ashrori · Built with Laravel &amp; React</div>
      </div>

      <div className="login-main">
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="lf-eyebrow">// ADMIN ACCESS</div>
          <h2>Selamat datang kembali</h2>
          <p className="sub">Masuk untuk mengelola konten portfolio Anda.</p>

          {error && <div className="login-err">{error}</div>}

          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="you@example.com"
            />
          </div>

          <div className="field">
            <label htmlFor="password">Password</label>
            <div className="field-pass">
              <input
                id="password"
                type={showPass ? 'text' : 'password'}
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="••••••••"
              />
              <button type="button" className="eye" onClick={() => setShowPass((v) => !v)} aria-label={showPass ? 'Sembunyikan' : 'Tampilkan'}>
                {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: 8 }}>
            {loading ? 'Memproses…' : 'Masuk'}
          </button>
        </form>
      </div>
    </div>
  )
}
