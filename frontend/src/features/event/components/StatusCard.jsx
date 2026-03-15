import { VIEW_STATES } from '@/domain/view-state'
import GlassPanel from '@/components/ui/GlassPanel'
import GoogleDots from '@/components/ui/GoogleDots'
import SectionHeader from '@/components/ui/SectionHeader'
import StatusBadge from '@/components/ui/StatusBadge'
import { eventViewsCopy } from '../copy/event'

export default function StatusCard({ activeView, error }) {
  const content = eventViewsCopy[activeView] ?? eventViewsCopy[VIEW_STATES.LOADING]

  return (
    <GlassPanel className="mx-auto max-w-card-narrow" variant="card">
      <div className="pad-card text-center md:px-12 md:pt-12 md:pb-10">
        <GoogleDots className="mb-8" />
        <div className="mb-8">
          <StatusBadge>{content.badge}</StatusBadge>
        </div>
        <SectionHeader
          align="center"
          description={content.description}
          title={content.title}
        />
        {error ? <p className="type-body mt-4 text-error">{error}</p> : null}
        {activeView === VIEW_STATES.LOADING ? (
          <div className="mx-auto mt-12 h-12 w-12 animate-spin rounded-full border-4 border-spinner-track border-t-primary" />
        ) : null}
      </div>
    </GlassPanel>
  )
}
