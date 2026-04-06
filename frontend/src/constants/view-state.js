export const VIEW_STATES = {
  WAITING: 'waiting',
  LIVE: 'live',
  ENDED: 'ended',
  LOADING: 'loading',
}

const VALID_VIEWS = new Set(Object.values(VIEW_STATES))

export function normalizeView(view) {
  return VALID_VIEWS.has(view) ? view : VIEW_STATES.WAITING
}
