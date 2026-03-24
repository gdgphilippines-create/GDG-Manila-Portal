import { VIEW_STATES } from '@/constants'

export const adminOverviewLabels = {
  tabsAriaLabel: 'Admin sections',
  overviewTabLabel: 'Overview',
  programTabLabel: 'Program',
  streamTabLabel: 'Stream',
  alertsTabLabel: 'Alert',
  eventDetailTitle: 'Event Detail',
  controlsTitle: 'Stream',
  alertsTitle: 'Alerts',
  eventMetaDescription:
    'Update the event headline, hero image, description, location, and date.',
}

export const adminActionsCopy = [
  {
    view: VIEW_STATES.WAITING,
    label: 'Waiting',
    tone: 'amber',
  },
  {
    view: VIEW_STATES.LIVE,
    label: 'Live',
    tone: 'emerald',
  },
  {
    view: VIEW_STATES.ENDED,
    label: 'End',
    tone: 'rose',
  },
]

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
