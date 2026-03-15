import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/useAuth'

export default function ProtectedRoute({ children, requiredRole }) {
  const { isAuthenticated, loading, user } = useAuth()
  const location = useLocation()

  if (loading) {
    return <div className="type-body px-6 py-10 text-center text-muted">Checking session...</div>
  }

  if (!isAuthenticated) {
    return <Navigate replace state={{ from: location }} to="/" />
  }

  if (requiredRole && user?.role !== requiredRole) {
    return (
      <div className="type-body px-6 py-10 text-center text-error">
        You do not have access to this area.
      </div>
    )
  }

  return children
}
