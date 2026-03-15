import GlassPanel from '@/components/ui/GlassPanel'
import { surfacePatterns } from '@/styles/layout'
import {
  LuCalendarDays,
  LuMapPin,
  LuPencil,
  LuUsers,
} from 'react-icons/lu'

function MetaItem({ children, icon }) {
  return (
    <div className="flex items-center gap-3 text-body">
      <span className="text-muted">{icon}</span>
      <span className="type-body">{children}</span>
    </div>
  )
}

export default function AdminOverviewCard({ event, labels, statusBadge }) {
  return (
    <GlassPanel variant="card">
      <div className="relative h-72 overflow-hidden bg-slate-50 md:h-96">
        <div className={surfacePatterns.bannerGradientClassName} />
      </div>

      <div className={`${surfacePatterns.panelBodyClassName} relative`}>
        <button
          className={surfacePatterns.floatingIconButtonClassName}
          title={labels.editEventLabel}
          type="button"
        >
          <LuPencil aria-hidden="true" className="h-5 w-5" />
        </button>

        <p className="type-meta italic">{event.eventTheme}</p>

        <div className="mt-6 flex flex-wrap items-center gap-4">
          <h2 className="type-hero">{event.eventName}</h2>
          {statusBadge}
        </div>

        <div className="mt-8 flex flex-wrap gap-x-8 gap-y-4">
          <MetaItem icon={<LuCalendarDays aria-hidden="true" className="h-5 w-5" />}>
            {event.date}
          </MetaItem>
          <MetaItem icon={<LuMapPin aria-hidden="true" className="h-5 w-5" />}>
            {event.location}
          </MetaItem>
          <MetaItem icon={<LuUsers aria-hidden="true" className="h-5 w-5" />}>
            {event.guestCount}
          </MetaItem>
        </div>

        <div className="mt-10 border-t border-divider-soft pt-8">
          <h4 className="type-body font-semibold text-heading">{labels.aboutTitle}</h4>
          <p className="type-body mt-3 italic text-muted">{event.aboutDescription}</p>
        </div>
      </div>
    </GlassPanel>
  )
}
