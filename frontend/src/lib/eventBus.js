const listeners = new Map()

export const EVENT_BUS_EVENTS = {
  VIEW_CHANGED: 'view:changed',
  AUTH_EXPIRED: 'auth:expired',
  EVENT_UPDATED: 'event:updated',
  PROGRAM_CHANGED: 'program:changed',
  ALERTS_CHANGED: 'alerts:changed',
  NOTIFICATION_RECEIVED: 'notification:received',
}

export function on(event, handler) {
  if (!listeners.has(event)) {
    listeners.set(event, new Set())
  }

  const handlers = listeners.get(event)
  handlers.add(handler)

  return () => {
    handlers.delete(handler)

    if (handlers.size === 0) {
      listeners.delete(event)
    }
  }
}

export function emit(event, payload) {
  const handlers = listeners.get(event)

  if (!handlers) {
    return
  }

  handlers.forEach((handler) => {
    handler(payload)
  })
}
