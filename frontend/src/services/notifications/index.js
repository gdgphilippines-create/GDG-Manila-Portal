import { getAlerts, postAlert } from '@/services/api/alerts'
import { createPollingSubscription } from '@/lib/createPollingSubscription'
import { config } from '@/lib/config'
import { emit, EVENT_BUS_EVENTS } from '@/lib/eventBus'

const ALERTS_POLL_INTERVAL_MS = 15000

function normalizeAlert(alert) {
  if (!alert || typeof alert !== 'object') {
    return { active: false }
  }

  if (alert.active === false) {
    return { active: false }
  }

  return {
    active: Boolean(alert.active),
    message: String(alert.message || ''),
    type: String(alert.type || 'info') || 'info',
    timestamp: alert.timestamp,
    createdBy: alert.createdBy,
  }
}

function normalizeNotification(notification) {
  if (!notification || typeof notification !== 'object') {
    return null
  }

  const message = String(notification.message || '').trim()

  if (!message) {
    return null
  }

  return {
    durationMs: 5000,
    id: notification.id || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    message,
    type: String(notification.type || 'info') || 'info',
  }
}

export const notificationsService = {
  async initialize() {
    if (config.isDev) {
      console.info('[notifications] initialize shared notifications service')
    }
  },

  async getCurrentAlert() {
    return normalizeAlert(await getAlerts())
  },

  async broadcastAlert(email, message, type = 'info') {
    const normalizedEmail = String(email || '').trim().toLowerCase()

    if (!normalizedEmail) {
      throw new Error('Login required to broadcast an alert.')
    }

    const savedAlert = normalizeAlert(await postAlert(normalizedEmail, message, type))
    emit(EVENT_BUS_EVENTS.ALERTS_CHANGED, savedAlert)
    return savedAlert
  },

  notify(message, options = {}) {
    const notification = normalizeNotification({
      ...options,
      message,
    })

    if (!notification) {
      return null
    }

    emit(EVENT_BUS_EVENTS.NOTIFICATION_RECEIVED, notification)
    return notification
  },

  subscribe(onChange) {
    return createPollingSubscription({
      event: EVENT_BUS_EVENTS.ALERTS_CHANGED,
      normalize: normalizeAlert,
      onChange,
      pollIntervalMs: ALERTS_POLL_INTERVAL_MS,
      read: () => notificationsService.getCurrentAlert(),
    })
  },
}
