import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export function ProtectedRoute({ children, requireOnboarding = true }) {
  const { user, loading, isOnboarded } = useAuth()
  const location = useLocation()

  if (loading) {
    return <div className="route-loader">Loading ORCHIDE...</div>
  }

  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />
  }

  if (requireOnboarding && !isOnboarded) {
    return <Navigate to="/onboarding" replace />
  }

  return children
}
