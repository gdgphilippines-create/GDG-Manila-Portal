import GlassPanel from '../../../components/ui/GlassPanel'
import GoogleDots from '../../../components/ui/GoogleDots'
import SectionHeader from '../../../components/ui/SectionHeader'
import StatusBadge from '../../../components/ui/StatusBadge'
import { VIEW_STATES } from '../../../state/viewState'
import { eventViewsCopy } from '../../../copy/event'

export default function StatusCard({ activeView, error }) {
  const content = eventViewsCopy[activeView] ?? eventViewsCopy[VIEW_STATES.LOADING]

  return (
    <GlassPanel className="max-w-[600px]">
      <div className="px-8 pb-10 pt-12 text-center md:px-12">
        <GoogleDots className="mb-8" />
        <div className="mb-8">
          <StatusBadge>{content.badge}</StatusBadge>
        </div>
        <SectionHeader
          align="center"
          description={content.description}
          title={content.title}
        />
        {error ? <p className="mt-4 text-sm text-[#c5221f]">{error}</p> : null}
        {activeView === VIEW_STATES.LOADING ? (
          <div className="mx-auto mt-12 h-12 w-12 rounded-full border-4 border-[#e8eaed] border-t-google-blue animate-spin" />
        ) : null}
      </div>
    </GlassPanel>
  )
}
