import { VIEW_STATES } from '@/core/constants'

export const adminOverviewLabels = {
  aboutTitle: 'About',
  editEventLabel: 'Edit event',
  tabsAriaLabel: 'Admin sections',
  overviewTabLabel: 'Overview',
  programTabLabel: 'Program',
  alertsTabLabel: 'Alerts',
  insightsTabLabel: 'Insights',
  insightsEyebrow: 'Insights',
  insightsTitle: 'Event insights',
  insightsDescription: 'Analytics and attendee trends will appear here.',
  controlsEyebrow: 'Stream Controls',
  controlsTitle: 'Update attendee state',
  alertsEyebrow: 'Alerts',
  alertsTitle: 'Status',
}

export const adminActionsCopy = [
  {
    view: VIEW_STATES.WAITING,
    label: 'Waiting Room',
    description: 'Set pre-show state',
    tone: 'amber',
  },
  {
    view: VIEW_STATES.LIVE,
    label: 'Live Event',
    description: 'Start main stage',
    tone: 'emerald',
  },
  {
    view: VIEW_STATES.ENDED,
    label: 'Ended',
    description: 'Close the event',
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
