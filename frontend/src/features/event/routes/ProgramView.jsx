import { useState } from 'react'
import PageShell from '@/components/layout/PageShell'
import { HeroBanner } from '@/components/ui'
import SessionTimeline from '../components/agenda/SessionTimeline'
import EventHeader from '../components/overview/EventHeader'
import EventSidebar from '../components/overview/EventSidebar'
import { useProgramViewModel } from '../hooks/useProgramViewModel'

function getDateRange(groups) {
  if (groups.length === 0) {
    return null
  }

  if (groups.length === 1) {
    return `${groups[0].dateLabel} · ${groups[0].dayLabel}`
  }

  return `${groups[0].dateLabel} - ${groups.at(-1)?.dateLabel ?? groups[0].dateLabel}`
}

function groupSessionsByDay(sessions) {
  return Object.values(
    sessions.reduce((groups, session) => {
      const groupId = `${session.schedule.dateLabel}-${session.schedule.dayLabel}`

      if (!groups[groupId]) {
        groups[groupId] = {
          id: groupId.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          dateLabel: session.schedule.dateLabel,
          dayLabel: session.schedule.dayLabel,
          sessions: [],
        }
      }

      groups[groupId].sessions.push(session)

      return groups
    }, {}),
  )
}

function ProgramContent({ eventMeta, isAdmin = false, sessions }) {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false)
  const [resourceNotice, setResourceNotice] = useState(null)
  const sessionGroups = groupSessionsByDay(sessions)

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
      eventMeta.pendingActionMessage.replace('{label}', label),
    )
  }

  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-8 md:py-12">
      <HeroBanner
        altText={eventMeta.heroImageAlt}
        imageUrl={eventMeta.heroImageUrl}
      />

      <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-12">
        <EventHeader
          description={isDescriptionExpanded ? eventMeta.fullDescription : eventMeta.description}
          onReadMore={handleReadMore}
          readMoreLabel={
            isDescriptionExpanded
              ? eventMeta.readLessDescriptionLabel
              : eventMeta.readFullDescriptionLabel
          }
          title={eventMeta.title}
        />
        <EventSidebar
          dateRange={getDateRange(sessionGroups)}
          location={eventMeta.eventDetails?.venue}
          tags={eventMeta.themes}
          themesHeading={eventMeta.themesHeading}
        />
      </div>

      {resourceNotice ? (
        <p className="mt-8 rounded-2xl border border-divider bg-card px-4 py-3 text-sm text-muted" role="status">
          {resourceNotice}
        </p>
      ) : null}

      <SessionTimeline groups={sessionGroups} isAdmin={isAdmin} onAction={handleSessionAction} />
    </section>
  )
}

function ProgramState({ children, status }) {
  if (status === 'loading' || status === 'idle') {
    return (
      <div className="mx-auto w-full max-w-5xl rounded-card border border-divider bg-card px-6 py-12 text-center text-muted">
        Loading program...
      </div>
    )
  }

  return children
}

export default function ProgramView({ isAdmin = false, withPageShell = true }) {
  const { eventMeta, sessions, status } = useProgramViewModel()
  const content = (
    <ProgramState status={status}>
      <ProgramContent eventMeta={eventMeta} isAdmin={isAdmin} sessions={sessions} />
    </ProgramState>
  )

  if (!withPageShell) {
    return content
  }

  return <PageShell>{content}</PageShell>
}
