import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/app/hooks'
import { protectedRouteCopy } from '@/app/copy'

export default function ProtectedRoute({ allowedRoles, children, requiredRole }) {
  const { isAuthenticated, loading, user } = useAuth()
  const location = useLocation()
  const acceptedRoles = allowedRoles ?? (requiredRole ? [requiredRole] : null)

  if (loading) {
    return (
      <div className="type-body px-6 py-10 text-center text-muted">
        {protectedRouteCopy.checkingSessionLabel}
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate replace state={{ from: location }} to="/" />
  }

  if (acceptedRoles && !acceptedRoles.includes(user?.role)) {
    return (
      <div className="type-body px-6 py-10 text-center text-error">
        {protectedRouteCopy.unauthorizedLabel}
      </div>
    )
  }

  return children
}
