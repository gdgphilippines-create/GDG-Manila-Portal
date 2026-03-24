import { useState } from 'react'
import { PageShell } from '@/components/layout'
import { HeroBanner } from '@/components/ui'
import { SessionTimeline, AlertBanner, EventHeader, EventSidebar } from '@/features/event'
import { useProgramViewModel } from '@/features/event/hooks/useProgramViewModel'
import { sortSessions } from '@/lib/programSessionUtils'

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
    sortSessions(sessions).reduce((groups, session) => {
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

function ProgramContent({ eventMeta, sessions }) {
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
    <section className="mx-auto w-full max-w-5xl px-4 py-6 md:py-10">
      <AlertBanner />

      <div className="overflow-hidden rounded-card border border-divider bg-card shadow-sm">
        <HeroBanner
          altText={eventMeta.heroImageAlt}
          framed={false}
          imageUrl={eventMeta.heroImageUrl}
        />

        <div className="px-6 py-6 md:px-8 md:py-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
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
            />
          </div>
        </div>
      </div>

      {resourceNotice ? (
        <p className="mt-8 rounded-2xl border border-divider bg-card px-4 py-3 text-sm text-body" role="status">
          {resourceNotice}
        </p>
      ) : null}

      <SessionTimeline groups={sessionGroups} onAction={handleSessionAction} />
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

export default function ProgramPage({ eventMetaOverride, sessionsOverride, withPageShell = true }) {
  const { eventMeta, sessions, status } = useProgramViewModel()
  const resolvedEventMeta = eventMetaOverride
    ? {
        ...eventMeta,
        ...eventMetaOverride,
        eventDetails: {
          ...eventMeta.eventDetails,
          ...eventMetaOverride.eventDetails,
        },
      }
    : eventMeta
  const resolvedSessions = sessionsOverride ?? sessions
  const resolvedStatus =
    eventMetaOverride || sessionsOverride ? 'success' : status
  const content = (
    <ProgramState status={resolvedStatus}>
      <ProgramContent eventMeta={resolvedEventMeta} sessions={resolvedSessions} />
    </ProgramState>
  )

  if (!withPageShell) {
    return content
  }

  return <PageShell navbarContentClassName="max-w-5xl">{content}</PageShell>
}
