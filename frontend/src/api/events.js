import { getActiveViewState } from './views'
import { eventPortalMeta } from '@/features/event/data/portalMeta'

export async function getEventDetails() {
  const activeView = await getActiveViewState()

  return {
    activeView,
    title: eventPortalMeta.title,
  }
}

export async function getSchedule() {
  return []
}

export async function getWorkshops() {
  return []
}
