import { VIEW_STATES } from '@/core/constants'

export const eventPortalCopy = {
  portalTitle: 'GDG Manila Event Portal',
}

export const eventViewsCopy = {
  [VIEW_STATES.WAITING]: {
    badge: 'Waiting Room',
    title: 'The event will start shortly.',
    description:
      'Stay on this page. We will switch everyone to the live experience once the stage opens.',
  },
  [VIEW_STATES.LIVE]: {
    badge: 'Live Now',
    title: 'Welcome to the Main Stage.',
    description:
      'The broadcast is active. Keep this tab open for announcements and session updates.',
  },
  [VIEW_STATES.ENDED]: {
    badge: 'Event Ended',
    title: 'The event has concluded.',
    description:
      'Thank you for joining GDG Manila. Check back soon for the next event schedule.',
  },
  [VIEW_STATES.LOADING]: {
    badge: 'Connecting',
    title: 'Connecting to stream controls.',
    description: 'We are syncing the attendee view with the current event status.',
  },
}
