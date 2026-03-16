import { getActiveViewState } from './views'
import { eventPortalCopy } from '@/copy/event'

export async function getEventDetails() {
  const activeView = await getActiveViewState()

  return {
    activeView,
    title: eventPortalCopy.portalTitle,
  }
}

export async function getSchedule() {
  return []
}

export async function getWorkshops() {
  return []
}
