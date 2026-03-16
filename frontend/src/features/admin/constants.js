export const ADMIN_TABS = Object.freeze({
  OVERVIEW: 'overview',
  PROGRAM: 'program',
  ALERTS: 'alerts',
  INSIGHTS: 'insights',
})

export const DEFAULT_ADMIN_TAB = ADMIN_TABS.OVERVIEW

export const ADMIN_TAB_ROUTES = Object.freeze({
  [ADMIN_TABS.OVERVIEW]: '/admin-panel/overview',
  [ADMIN_TABS.PROGRAM]: '/admin-panel/program',
  [ADMIN_TABS.ALERTS]: '/admin-panel/alerts',
  [ADMIN_TABS.INSIGHTS]: '/admin-panel/insights',
})
