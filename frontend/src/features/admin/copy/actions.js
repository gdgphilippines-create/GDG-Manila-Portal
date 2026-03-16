import { VIEW_STATES } from '@/core/constants'

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
