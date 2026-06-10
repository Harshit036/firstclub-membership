import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { auth, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/')
  }

  const isAdmin = auth?.role === 'admin'

  return (
    <nav className="bg-[#1b3a2d] text-white px-6 py-3.5 flex items-center justify-between shadow-md">
      <div className="flex items-center gap-3">
        <span className="font-extrabold text-xl tracking-tight">
          <span className="text-orange-400">F</span>IRSTCLUB
        </span>
        <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium
          ${isAdmin ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30' : 'bg-green-700/40 text-green-300 border border-green-600/30'}`}>
          {isAdmin ? 'Admin' : 'Member'}
        </span>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-green-200 hidden sm:block">{auth?.name || auth?.email}</span>
        <button
          onClick={handleLogout}
          className="text-xs border border-white/20 hover:bg-white/10 px-3.5 py-1.5 rounded-lg transition-colors text-white/80 hover:text-white"
        >
          Logout
        </button>
      </div>
    </nav>
  )
}
