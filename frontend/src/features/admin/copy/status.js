import { VIEW_STATES } from '@/core/constants'

export const adminStatusCopy = {
  updating: {
    label: 'Updating',
    tone: 'warning',
  },
  [VIEW_STATES.WAITING]: {
    label: 'Waiting Room',
    tone: 'warning',
  },
  [VIEW_STATES.LIVE]: {
    label: 'Live',
    tone: 'success',
  },
  [VIEW_STATES.ENDED]: {
    label: 'Ended',
    tone: 'danger',
  },
  [VIEW_STATES.LOADING]: {
    label: 'Syncing',
    tone: 'neutral',
  },
}

export function getAdminStatusPill(activeView, isPending = false) {
  if (isPending) {
    return adminStatusCopy.updating
  }

  return adminStatusCopy[activeView] ?? adminStatusCopy[VIEW_STATES.LOADING]
}
