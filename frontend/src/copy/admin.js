import { VIEW_STATES } from '../state/viewState'

export const adminPageCopy = {
  eyebrow: 'Admin Panel',
  title: 'Event Control Center',
  description:
    'Control the attendee experience from one place and reuse the same state model across every screen.',
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
