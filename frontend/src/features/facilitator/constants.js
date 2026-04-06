export const FACILITATOR_TABS = Object.freeze({
  OVERVIEW: 'overview',
  VERIFICATION: 'verification',
})

export const DEFAULT_FACILITATOR_TAB = FACILITATOR_TABS.OVERVIEW

export const FACILITATOR_TAB_ROUTES = Object.freeze({
  [FACILITATOR_TABS.OVERVIEW]: '/facilitator/overview',
  [FACILITATOR_TABS.VERIFICATION]: '/facilitator/verification',
})

export const facilitatorLabels = {
  tabsAriaLabel: 'Facilitator sections',
  overviewTabLabel: 'Overview',
  verificationTabLabel: 'Verification',
}
