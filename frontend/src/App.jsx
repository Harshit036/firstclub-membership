import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import LoginPage from './pages/LoginPage'
import UserDashboard from './pages/UserDashboard'
import AdminPanel from './pages/AdminPanel'

function ProtectedRoute({ children, requiredRole }) {
  const { auth } = useAuth()
  if (!auth) return <Navigate to="/" replace />
  if (requiredRole && auth.role !== requiredRole) return <Navigate to="/" replace />
  return children
}

function AppRoutes() {
  const { auth } = useAuth()
  return (
    <Routes>
      <Route path="/" element={auth ? <Navigate to={auth.role === 'admin' ? '/admin' : '/user'} replace /> : <LoginPage />} />
      <Route path="/user" element={<ProtectedRoute requiredRole="user"><UserDashboard /></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><AdminPanel /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}
