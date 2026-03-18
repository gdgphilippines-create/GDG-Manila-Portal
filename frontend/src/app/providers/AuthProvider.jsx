import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  persistVerifiedUser,
  logout as logoutRequest,
  verifyUser,
} from '@/api/auth'
import { ROLES } from '@/core/constants/roles'
import { AuthContext } from './authContext'

export function AuthProvider({ children }) {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    async function resetSession() {
      try {
        await logoutRequest()
      } finally {
        if (mounted) {
          setUser(null)
          setLoading(false)
        }
      }
    }

    resetSession()

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

      navigate(nextUser?.role === ROLES.ADMIN ? '/admin-panel' : '/', { replace: true })

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
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
