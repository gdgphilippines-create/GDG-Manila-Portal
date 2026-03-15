import { config } from '../../lib/config'
import { localStorageProvider } from './providers/localStorageProvider'
import { firebaseProvider } from './providers/firebaseProvider'

const provider =
  config.viewSyncProvider === 'firebase' ? firebaseProvider : localStorageProvider

export function getActiveView() {
  return provider.getActiveView()
}

export function setActiveView(view) {
  return provider.setActiveView(view)
}

export function subscribeToActiveView(onChange) {
  return provider.subscribe(onChange)
}
