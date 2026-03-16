import { LuCalendarDays, LuMapPin } from 'react-icons/lu'
import TagBadge from '../shared/TagBadge'

export default function EventSidebar({ dateRange, location, tags = [], themesHeading = 'Key Themes' }) {
  return (
    <aside className="space-y-8 lg:col-span-4" data-purpose="event-sidebar">
      <div className="space-y-4 border-l border-divider pl-6 text-sm text-muted">
        {location ? (
          <div className="flex items-start gap-3">
            <LuMapPin aria-hidden="true" className="mt-0.5 h-5 w-5 text-muted" />
            <span>{location}</span>
          </div>
        ) : null}
        {dateRange ? (
          <div className="flex items-start gap-3">
            <LuCalendarDays aria-hidden="true" className="mt-0.5 h-5 w-5 text-muted" />
            <span>{dateRange}</span>
          </div>
        ) : null}
      </div>

      {tags.length > 0 ? (
        <div className="pl-6">
          <h4 className="font-label text-xs font-bold uppercase tracking-[0.18em] text-heading">
            {themesHeading}
          </h4>
          <div className="mt-4 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <TagBadge key={tag.id ?? tag.label} label={tag.label} tone={tag.tone} />
            ))}
          </div>
        </div>
      ) : null}
    </aside>
  )
}
