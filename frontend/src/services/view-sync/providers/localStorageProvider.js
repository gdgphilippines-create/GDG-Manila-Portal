import { emit, EVENT_BUS_EVENTS, on } from '../../../lib/eventBus'
import { VIEW_STATES, normalizeView } from '../../../state/viewState'

const VIEW_STATE_KEY = 'gdg-manila-active-view'

function readView() {
  if (typeof window === 'undefined') {
    return VIEW_STATES.WAITING
  }

  return normalizeView(window.localStorage.getItem(VIEW_STATE_KEY))
}

export const localStorageProvider = {
  async getActiveView() {
    return readView()
  },

  async setActiveView(view) {
    if (typeof window === 'undefined') {
      return
    }

    const nextView = normalizeView(view)
    window.localStorage.setItem(VIEW_STATE_KEY, nextView)
    emit(EVENT_BUS_EVENTS.VIEW_CHANGED, nextView)
  },

  subscribe(onChange) {
    if (typeof window === 'undefined') {
      return () => {}
    }

    const syncView = () => {
      onChange(readView())
    }

    const handleStorage = (event) => {
      if (event.key && event.key !== VIEW_STATE_KEY) {
        return
      }

      syncView()
    }

    const unsubscribeBus = on(EVENT_BUS_EVENTS.VIEW_CHANGED, syncView)

    window.addEventListener('storage', handleStorage)

    return () => {
      unsubscribeBus()
      window.removeEventListener('storage', handleStorage)
    }
  },
}
