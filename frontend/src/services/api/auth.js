import { config } from '@/lib/config'
import { ROLES } from '@/constants/roles'
import { apiRequest } from './client'

const AUTH_STORAGE_KEY = 'gdg-manila-auth-user'
const MOCK_AUTH_ERROR_MESSAGE = 'Email not found in registry'
const MOCK_AUTH_ROSTER = [
  {
    email: 'admin@gdg.test',
    role: 'admin',
    firstName: 'Admin',
  },
  {
    email: 'facilitator@gdg.test',
    role: 'facilitator',
    firstName: 'Faci',
  },
  {
    email: 'user@gdg.test',
    role: 'participant',
    firstName: 'Participant',
  },
]

function normalizeRole(role) {
  switch (String(role || '').toLowerCase()) {
    case 'admin':
      return ROLES.ADMIN
    case 'facilitator':
      return ROLES.FACILITATOR
    case 'participant':
    case 'attendee':
      return ROLES.PARTICIPANT
    default:
      return role
  }
}

function normalizeUser(user) {
  if (!user) {
    return null
  }

  return {
    ...user,
    id: user.id || user.email,
    name: user.name || user.firstName || user.email,
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

/**
 * @typedef {Object} VerifiedUser
 * @property {string} email
 * @property {'ADMIN' | 'FACILITATOR' | 'PARTICIPANT'} role
 * @property {string} [firstName]
 * @property {string} [id]
 */

/**
 * @typedef {Object} UserVerificationResponse
 * @property {boolean} success
 * @property {VerifiedUser} [user]
 * @property {string} [error]
 */

/**
 * Verifies a user against the backend auth route and returns the normalized user.
 *
 * Mirrors `POST /api/auth/verify` from the backend auth router.
 *
 * @param {string} email
 * @returns {Promise<UserVerificationResponse>}
 */
export async function verifyUser(email) {
  const normalizedEmail = String(email || '').trim().toLowerCase()

  if (config.enableMockAuth) {
    const mockUser = MOCK_AUTH_ROSTER.find((entry) => entry.email === normalizedEmail)

    if (!mockUser) {
      return {
        success: false,
        error: MOCK_AUTH_ERROR_MESSAGE,
      }
    }

    return {
      success: true,
      user: mockUser,
    }
  }

  return apiRequest('/auth/verify', {
    method: 'POST',
    body: JSON.stringify({ email: normalizedEmail }),
  })
}

export async function logout() {
  writeStoredUser(null)
}

export async function getCurrentUser() {
  return readStoredUser()
}

export function getAuthEmail() {
  const user = readStoredUser()
  return String(user?.email || '').trim().toLowerCase()
}

export function persistVerifiedUser(user) {
  const normalizedUser = normalizeUser(user)
  writeStoredUser(normalizedUser)
  return normalizedUser
}
