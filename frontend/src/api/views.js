import { getActiveView, setActiveView, subscribeToActiveView } from '../services/view-sync'

export async function getActiveViewState() {
  return getActiveView()
}

export async function setActiveViewState(view) {
  await setActiveView(view)
}

export function subscribeToView(onChange) {
  return subscribeToActiveView(onChange)
}
