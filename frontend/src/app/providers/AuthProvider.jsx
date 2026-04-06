import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  getCurrentUser,
  persistVerifiedUser,
  logout as logoutRequest,
  verifyUser,
} from '@/services/api/auth'
import { ROLES } from '@/constants/roles'
import { AuthContext } from './authContext'

function getPostLoginRoute(role) {
  if (role === ROLES.ADMIN) return '/admin-panel'
  if (role === ROLES.FACILITATOR) return '/facilitator'
  return '/'
}

export function AuthProvider({ children }) {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    async function initializeSession() {
      try {
        const currentUser = await getCurrentUser()

        if (mounted) {
          setUser(currentUser)
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    initializeSession()

    return () => {
      mounted = false
    }
  }, [])

  async function login(email) {
    try {
      const response = await verifyUser(email)

      if (!response?.success || !response.user) {
        return {
          success: false,
          error: response?.error || 'Unable to verify user',
        }
      }

      const nextUser = persistVerifiedUser(response.user)
      setUser(nextUser)

      navigate(getPostLoginRoute(nextUser?.role), { replace: true })

      return {
        success: true,
        user: nextUser,
      }
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Unable to verify user',
      }
    }
  }

  async function logout() {
    try {
      await logoutRequest()
    } finally {
      setUser(null)
    }
  }

  const value = {
    user,
    loading,
    isAuthenticated: Boolean(user),
    isAdmin: user?.role === ROLES.ADMIN,
    isFacilitator: user?.role === ROLES.FACILITATOR,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
