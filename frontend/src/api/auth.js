import { config } from '@/lib/config'
import { ROLES } from '@/core/constants/roles'
import { setStoredToken } from './client'

const AUTH_STORAGE_KEY = 'gdg-manila-auth-user'

function normalizeRole(role) {
  if (role === 'admin') {
    return ROLES.ADMIN
  }

  return role
}

function normalizeUser(user) {
  if (!user) {
    return null
  }

  return {
    ...user,
    role: normalizeRole(user.role),
  }
}

function readStoredUser() {
  if (typeof window === 'undefined') {
    return null
  }

  const rawValue = window.localStorage.getItem(AUTH_STORAGE_KEY)

  if (!rawValue) {
    return null
  }

  try {
    return normalizeUser(JSON.parse(rawValue))
  } catch {
    return null
  }
}

function writeStoredUser(user) {
  if (typeof window === 'undefined') {
    return
  }

  if (user) {
    window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(normalizeUser(user)))
    return
  }

  window.localStorage.removeItem(AUTH_STORAGE_KEY)
}

export async function login(credentials = {}) {
  const user = {
    id: 'local-admin',
    email: credentials.email || 'admin@gdgmanila.local',
    role: ROLES.ADMIN,
  }

  writeStoredUser(user)
  setStoredToken('local-dev-token')

  return user
}

export async function logout() {
  writeStoredUser(null)
  setStoredToken('')
}

export async function refreshToken() {
  if (!config.enableMockAuth) {
    return null
  }

  setStoredToken('local-dev-token')
  return 'local-dev-token'
}

export async function getCurrentUser() {
  const storedUser = readStoredUser()

  if (storedUser) {
    return storedUser
  }

  if (!config.enableMockAuth) {
    return null
  }

  const defaultUser = {
    id: 'local-admin',
    email: 'admin@gdgmanila.local',
    role: ROLES.ADMIN,
  }

  writeStoredUser(defaultUser)
  setStoredToken('local-dev-token')

  return defaultUser
}
