import { useEffect, useState } from 'react'
import {
  getCurrentUser,
  login as loginRequest,
  logout as logoutRequest,
} from '@/api/auth'
import { ROLES } from '@/core/constants/roles'
import { AuthContext } from './authContext'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    async function loadSession() {
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

    loadSession()

    return () => {
      mounted = false
    }
  }, [])

  async function login(credentials) {
    const nextUser = await loginRequest(credentials)
    setUser(nextUser)
    return nextUser
  }

  async function logout() {
    await logoutRequest()
    setUser(null)
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
