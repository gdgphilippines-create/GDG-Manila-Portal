import { setActiveView } from './index'

export async function executeAction(actionId) {
  await setActiveView(actionId)
}
