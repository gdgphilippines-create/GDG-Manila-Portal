import InteractiveTabs from '@/components/layout/InteractiveTabs'
import ViewFrame from '@/components/layout/ViewFrame'
import StatusPill from '@/components/ui/StatusPill'

const ADMIN_TABS = {
  OVERVIEW: 'overview',
  PROGRAM: 'program',
  ALERTS: 'alerts',
  INSIGHTS: 'insights',
}

export default function AdminSection({
  activeTab,
  children,
  currentStatus,
  event,
  labels,
}) {
  const tabs = [
    { id: ADMIN_TABS.OVERVIEW, label: labels.overviewTabLabel, to: '/admin-panel/overview' },
    { id: ADMIN_TABS.PROGRAM, label: labels.programTabLabel, to: '/admin-panel/program' },
    { id: ADMIN_TABS.ALERTS, label: labels.alertsTabLabel, to: '/admin-panel/alerts' },
    { id: ADMIN_TABS.INSIGHTS, label: labels.insightsTabLabel, to: '/admin-panel/insights' },
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
