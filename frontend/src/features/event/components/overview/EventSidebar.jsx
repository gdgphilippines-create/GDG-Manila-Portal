import { LuCalendarDays, LuMapPin } from 'react-icons/lu'

export default function EventSidebar({ dateRange, location }) {
  return (
    <aside className="lg:col-span-4" data-purpose="event-sidebar">
      <div className="border-t border-divider pt-6 lg:border-t-0 lg:border-l lg:pl-6 lg:pt-0">
        <p className="font-label text-xs font-semibold uppercase tracking-label-wide text-muted">
          Event Details
        </p>
        <div className="mt-4 space-y-3">
          {location ? (
            <div className="flex items-start gap-3">
              <LuMapPin aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-muted" />
              <span className="text-sm leading-6 text-body">{location}</span>
            </div>
          ) : null}
          {dateRange ? (
            <div className="flex items-start gap-3">
              <LuCalendarDays aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-muted" />
              <span className="text-sm leading-6 text-body">{dateRange}</span>
            </div>
          ) : null}
        </div>
      </div>
    </aside>
  )
}
