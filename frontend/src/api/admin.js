import { setActiveViewState } from './views'

export async function getAdminActions() {
  return ['waiting', 'live', 'ended']
}

export async function executeAction(actionId) {
  await setActiveViewState(actionId)
}
