import { InteractiveTabs, ViewFrame } from '@/components/layout'
import { StatusPill } from '@/components/ui'

import { ADMIN_TABS, ADMIN_TAB_ROUTES } from '../constants'

export default function AdminSection({
  activeTab,
  children,
  currentStatus,
  event,
  labels,
}) {
  const tabs = [
    { id: ADMIN_TABS.OVERVIEW, label: labels.overviewTabLabel, to: ADMIN_TAB_ROUTES[ADMIN_TABS.OVERVIEW] },
    { id: ADMIN_TABS.PROGRAM, label: labels.programTabLabel, to: ADMIN_TAB_ROUTES[ADMIN_TABS.PROGRAM] },
    { id: ADMIN_TABS.STREAM, label: labels.streamTabLabel, to: ADMIN_TAB_ROUTES[ADMIN_TABS.STREAM] },
    { id: ADMIN_TABS.ALERTS, label: labels.alertsTabLabel, to: ADMIN_TAB_ROUTES[ADMIN_TABS.ALERTS] },
  ]

  return (
    <ViewFrame>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-6">
        <div className="flex flex-wrap items-center gap-4">
          <h1 className="type-hero">{event.eventName}</h1>
          <StatusPill label={currentStatus.label} tone={currentStatus.tone} />
        </div>
      </div>

      <div className="w-full space-y-8">
        <InteractiveTabs activeTab={activeTab} ariaLabel={labels.tabsAriaLabel} tabs={tabs} />
        {children}
      </div>
    </ViewFrame>
  )
}
