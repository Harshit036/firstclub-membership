import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getUsers } from '../api/client'

const DEMO_EMAILS = ['alice@example.com', 'bob@example.com', 'carol@example.com']
const ADMIN_EMAIL = 'admin@firstclub.com'
const ADMIN_PASSWORD = 'admin'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [mode, setMode] = useState(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleUserLogin(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const users = await getUsers()
      const found = users.find(u => u.email.toLowerCase() === email.toLowerCase())
      if (!found) { setError('Email not found. Try: ' + DEMO_EMAILS.join(', ')); return }
      login({ role: 'user', userId: found.id, email: found.email, name: found.name })
      navigate('/user')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function handleAdminLogin(e) {
    e.preventDefault()
    setError('')
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      login({ role: 'admin', email: ADMIN_EMAIL, name: 'Admin' })
      navigate('/admin')
    } else {
      setError('Invalid credentials. Use admin@firstclub.com / admin')
    }
  }

  return (
    <div className="min-h-screen bg-[#f0f5e8] flex flex-col">
      {/* Top bar */}
      <div className="bg-[#1b3a2d] px-6 py-4">
        <span className="font-extrabold text-xl text-white tracking-tight">
          <span className="text-orange-400">F</span>IRSTCLUB
        </span>
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#1b3a2d]">Membership Portal</h1>
            <p className="text-green-800/60 mt-1 text-sm">Groceries you don't have to Second Guess</p>
          </div>

          {!mode && (
            <div className="space-y-3">
              <p className="text-center text-[#1b3a2d]/70 text-sm font-medium mb-5">Sign in to continue</p>
              <button
                onClick={() => setMode('user')}
                className="w-full bg-white border-2 border-[#1b3a2d]/10 rounded-2xl p-5 text-left hover:border-[#1b3a2d]/40 hover:shadow-md transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-xl flex-shrink-0">
                    👤
                  </div>
                  <div>
                    <div className="font-semibold text-[#1b3a2d] group-hover:text-green-800">I'm a Member</div>
                    <div className="text-sm text-gray-500 mt-0.5">Browse plans, manage your subscription</div>
                  </div>
                </div>
              </button>
              <button
                onClick={() => setMode('admin')}
                className="w-full bg-white border-2 border-[#1b3a2d]/10 rounded-2xl p-5 text-left hover:border-orange-400/60 hover:shadow-md transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-xl flex-shrink-0">
                    🛠️
                  </div>
                  <div>
                    <div className="font-semibold text-[#1b3a2d] group-hover:text-orange-700">I'm an Admin</div>
                    <div className="text-sm text-gray-500 mt-0.5">Manage plans, prices and benefits</div>
                  </div>
                </div>
              </button>
            </div>
          )}

          {mode === 'user' && (
            <div className="bg-white rounded-2xl shadow-sm border border-[#1b3a2d]/10 p-6">
              <button onClick={() => { setMode(null); setError('') }} className="text-sm text-[#1b3a2d]/60 hover:text-[#1b3a2d] mb-4 inline-flex items-center gap-1">
                ← Back
              </button>
              <h2 className="text-xl font-bold text-[#1b3a2d] mb-1">Member Login</h2>
              <p className="text-sm text-gray-400 mb-5">
                Demo: <span className="font-mono text-xs text-gray-500">{DEMO_EMAILS.join(' · ')}</span>
              </p>
              <form onSubmit={handleUserLogin} className="space-y-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b3a2d]/30"
                />
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-xl py-2.5 text-sm font-semibold disabled:opacity-60 transition-colors"
                >
                  {loading ? 'Signing in…' : 'GET STARTED'}
                </button>
              </form>
            </div>
          )}

          {mode === 'admin' && (
            <div className="bg-white rounded-2xl shadow-sm border border-[#1b3a2d]/10 p-6">
              <button onClick={() => { setMode(null); setError('') }} className="text-sm text-[#1b3a2d]/60 hover:text-[#1b3a2d] mb-4 inline-flex items-center gap-1">
                ← Back
              </button>
              <h2 className="text-xl font-bold text-[#1b3a2d] mb-1">Admin Login</h2>
              <p className="text-sm text-gray-400 mb-5">
                Use <span className="font-mono text-xs">admin@firstclub.com</span> / <span className="font-mono text-xs">admin</span>
              </p>
              <form onSubmit={handleAdminLogin} className="space-y-3">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b3a2d]/30"
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b3a2d]/30"
                />
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button
                  type="submit"
                  className="w-full bg-[#1b3a2d] hover:bg-[#152e23] text-white rounded-xl py-2.5 text-sm font-semibold transition-colors"
                >
                  Sign In as Admin
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
