import { config } from '@/lib/config'
import { apiRequest } from './client'
import { getAuthEmail } from './auth'

const MOCK_ALERT_STORAGE_KEY = 'gdg-manila-mock-alert'

function readMockAlert() {
  if (typeof window === 'undefined') {
    return { active: false }
  }

  const rawValue = window.localStorage.getItem(MOCK_ALERT_STORAGE_KEY)

  if (!rawValue) {
    return { active: false }
  }

  try {
    const parsed = JSON.parse(rawValue)
    return typeof parsed === 'object' && parsed !== null ? parsed : { active: false }
  } catch {
    return { active: false }
  }
}

function writeMockAlert(alert) {
  if (typeof window === 'undefined') {
    return
  }

  if (!alert) {
    window.localStorage.removeItem(MOCK_ALERT_STORAGE_KEY)
    return
  }

  window.localStorage.setItem(MOCK_ALERT_STORAGE_KEY, JSON.stringify(alert))
}

/**
 * @typedef {Object} ActiveAlert
 * @property {string} message
 * @property {string} [type]
 * @property {boolean} active
 * @property {string} [timestamp]
 * @property {string} [createdBy]
 */

/**
 * Mirrors `GET /api/alerts` from the backend contract.
 *
 * @returns {Promise<ActiveAlert | { active: false }>}
 */
export async function getAlerts() {
  if (config.enableMockAuth) {
    return readMockAlert()
  }

  return apiRequest('/alerts')
}

/**
 * Mirrors `POST /api/alerts` from the backend contract.
 *
 * @param {string} email
 * @param {string} message
 * @param {string} [type]
 */
export async function postAlert(email, message, type = 'info') {
  const resolvedEmail = String(email || '').trim().toLowerCase() || getAuthEmail()
  const payload = {
    email: resolvedEmail,
    message: String(message || '').trim(),
    type: String(type || 'info').trim() || 'info',
  }

  if (config.enableMockAuth) {
    const nextAlert = {
      active: Boolean(payload.message),
      message: payload.message,
      type: payload.type,
      timestamp: new Date().toISOString(),
      createdBy: resolvedEmail,
    }

    writeMockAlert(nextAlert.active ? nextAlert : { active: false })
    return nextAlert.active ? nextAlert : { active: false }
  }

  return apiRequest('/alerts', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}
