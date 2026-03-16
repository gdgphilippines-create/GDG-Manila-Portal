import { useState } from 'react'
import { HeroBanner } from '@/components/ui'
import { VIEW_STATES } from '@/core/constants'
import EventHeader from '../overview/EventHeader'
import EventSidebar from '../overview/EventSidebar'
import SessionTimeline from '../agenda/SessionTimeline'
import StatusCard from '../status/StatusCard'
import { programCopy } from '../../copy/programCopy'
import { programSessionGroups } from '../../data/programSessions'
import { useEventViewModel } from '../../hooks/useEventViewModel'

function getDateRange(groups) {
  if (groups.length === 0) {
    return null
  }

  if (groups.length === 1) {
    return `${groups[0].dateLabel} · ${groups[0].dayLabel}`
  }

  return `${groups[0].dateLabel} - ${groups.at(-1)?.dateLabel ?? groups[0].dateLabel}`
}

export default function EventSection() {
  const { currentView, error } = useEventViewModel()
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false)
  const [resourceNotice, setResourceNotice] = useState(null)

  if (currentView !== VIEW_STATES.LIVE || error) {
    return <StatusCard activeView={currentView} error={error} />
  }

  function handleReadMore() {
    setIsDescriptionExpanded((value) => !value)
  }

  function handleSessionAction(action, label) {
    if (action.href) {
      window.open(action.href, '_blank', 'noopener,noreferrer')
      setResourceNotice(null)
      return
    }

    setResourceNotice(
      programCopy.pendingActionMessage.replace('{label}', label),
    )
  }

  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-8 md:py-12">
      <HeroBanner
        altText={programCopy.heroImageAlt}
        imageUrl={programCopy.heroImageUrl}
      />

      <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-12">
        <EventHeader
          description={isDescriptionExpanded ? programCopy.fullDescription : programCopy.description}
          onReadMore={handleReadMore}
          readMoreLabel={
            isDescriptionExpanded
              ? programCopy.readLessDescriptionLabel
              : programCopy.readFullDescriptionLabel
          }
          title={programCopy.title}
        />
        <EventSidebar
          dateRange={getDateRange(programSessionGroups)}
          location={programCopy.eventDetails.venue}
          tags={programCopy.themes}
          themesHeading={programCopy.themesHeading}
        />
      </div>

      {resourceNotice ? (
        <p className="mt-8 rounded-2xl border border-divider bg-card px-4 py-3 text-sm text-muted" role="status">
          {resourceNotice}
        </p>
      ) : null}

      <SessionTimeline groups={programSessionGroups} onAction={handleSessionAction} />
    </section>
  )
}
