import ViewFrame from '@/components/layout/ViewFrame'
import GlassPanel from '@/components/ui/GlassPanel'
import SectionHeader from '@/components/ui/SectionHeader'
import StatusPill from '@/components/ui/StatusPill'
import ActionGrid from '@/features/admin/components/controls/ActionGrid'
import AdminOverviewCard from '@/features/admin/components/overview/AdminOverviewCard'
import { surfacePatterns } from '@/styles/layout'
import { LuArrowLeft } from 'react-icons/lu'

export default function AdminSection({
  actions,
  currentStatus,
  error,
  event,
  isPending,
  labels,
  onSelect,
}) {
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
        <AdminOverviewCard
          event={event}
          labels={labels}
          statusBadge={<StatusPill label={currentStatus.label} tone={currentStatus.tone} />}
        />

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
      </div>
    </ViewFrame>
  )
}
