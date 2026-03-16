import InteractiveTabs from '@/components/layout/InteractiveTabs'
import ViewFrame from '@/components/layout/ViewFrame'
import StatusPill from '@/components/ui/StatusPill'

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
    { id: ADMIN_TABS.ALERTS, label: labels.alertsTabLabel, to: ADMIN_TAB_ROUTES[ADMIN_TABS.ALERTS] },
    { id: ADMIN_TABS.INSIGHTS, label: labels.insightsTabLabel, to: ADMIN_TAB_ROUTES[ADMIN_TABS.INSIGHTS] },
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
