import { useState } from 'react'
import InteractiveTabs from '@/components/layout/InteractiveTabs'
import ViewFrame from '@/components/layout/ViewFrame'
import GlassPanel from '@/components/ui/GlassPanel'
import SectionHeader from '@/components/ui/SectionHeader'
import StatusPill from '@/components/ui/StatusPill'
import ActionGrid from '@/features/admin/components/controls/ActionGrid'
import AdminOverviewCard from '@/features/admin/components/overview/AdminOverviewCard'
import { surfacePatterns } from '@/styles/layout'
import { LuArrowLeft } from 'react-icons/lu'

const ADMIN_TABS = {
  OVERVIEW: 'overview',
  PROGRAM: 'program',
  ALERTS: 'alerts',
}

export default function AdminSection({
  actions,
  currentStatus,
  error,
  event,
  isPending,
  labels,
  onSelect,
}) {
  const [activeTab, setActiveTab] = useState(ADMIN_TABS.OVERVIEW)
  const tabs = [
    { id: ADMIN_TABS.OVERVIEW, label: labels.overviewTabLabel },
    { id: ADMIN_TABS.PROGRAM, label: labels.programTabLabel },
    { id: ADMIN_TABS.ALERTS, label: labels.alertsTabLabel },
  ]

  return (
    <ViewFrame>
      <div className="mb-6">
        <div aria-label={labels.backLabel} className="inline-flex items-center gap-2 text-muted">
          <LuArrowLeft aria-hidden="true" className="h-4 w-4" />
          <span className="type-body text-sm">{labels.backLabel}</span>
        </div>
      </div>

      <div className="mb-8 flex flex-wrap items-end justify-between gap-6">
        <div className="flex flex-wrap items-center gap-4">
          <h1 className="type-hero">{event.eventName}</h1>
          <StatusPill label={currentStatus.label} tone={currentStatus.tone} />
        </div>
      </div>

      <div className="w-full space-y-8">
        <InteractiveTabs
          activeTab={activeTab}
          ariaLabel={labels.tabsAriaLabel}
          onChange={setActiveTab}
          tabs={tabs}
        />

        {activeTab === ADMIN_TABS.OVERVIEW ? (
          <AdminOverviewCard
            event={event}
            labels={labels}
            statusBadge={<StatusPill label={currentStatus.label} tone={currentStatus.tone} />}
          />
        ) : null}

        {activeTab === ADMIN_TABS.PROGRAM ? (
          <GlassPanel variant="card">
            <div className={surfacePatterns.panelBodyClassName}>
              <SectionHeader
                description={labels.controlsDescription}
                eyebrow={labels.controlsEyebrow}
                title={labels.controlsTitle}
              />
              {error ? <p className="type-body mt-6 text-error">{error}</p> : null}
              <div className="mt-8">
                <ActionGrid actions={actions} isPending={isPending} onSelect={onSelect} />
              </div>
            </div>
          </GlassPanel>
        ) : null}

        {activeTab === ADMIN_TABS.ALERTS ? (
          <GlassPanel variant="card">
            <div className={surfacePatterns.panelBodyClassName}>
              <SectionHeader eyebrow={labels.alertsEyebrow} title={labels.alertsTitle} />
              {error ? <p className="type-body mt-6 text-error">{error}</p> : null}
            </div>
          </GlassPanel>
        ) : null}
      </div>
    </ViewFrame>
  )
}
