import { getActiveViewState } from './views'

export async function getEventDetails() {
  const activeView = await getActiveViewState()

  return {
    activeView,
    title: 'GDG Manila Event Portal',
  }
}

export async function getSchedule() {
  return []
}

export async function getWorkshops() {
  return []
}
