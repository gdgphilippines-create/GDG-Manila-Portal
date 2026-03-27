import { useState } from 'react'
import { PageShell } from '@/components/layout'
import { HeroBanner } from '@/components/ui'
import { SessionTimeline, EventHeader, EventSidebar, useProgramViewModel } from '@/features/event'
import { sortSessions } from '@/lib/programSessionUtils'
import { notificationsService } from '@/services/notifications'

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
  const sessionGroups = groupSessionsByDay(sessions)

  function handleReadMore() {
    setIsDescriptionExpanded((value) => !value)
  }

  function handleSessionAction(action, label) {
    if (action.href) {
      window.open(action.href, '_blank', 'noopener,noreferrer')
      return
    }

    notificationsService.notify(eventMeta.pendingActionMessage.replace('{label}', label), {
      type: 'info',
    })
  }

  return (
    <section className="pb-6 md:pb-10">
      <div className="border-y border-divider/80 bg-[linear-gradient(180deg,_rgb(var(--color-bg-card))_0%,_rgb(var(--color-bg-page))_100%)]">
        <HeroBanner
          altText={eventMeta.heroImageAlt}
          framed={false}
          imageUrl={eventMeta.heroImageUrl}
          imageFit="contain"
        />

        <div className="mx-auto w-full max-w-5xl px-4 py-8 md:px-6 md:py-10 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <EventHeader
              description={isDescriptionExpanded ? eventMeta.fullDescription : eventMeta.description}
              isDescriptionExpanded={isDescriptionExpanded}
              onToggleDescription={handleReadMore}
              title={eventMeta.title}
              toggleDescriptionLabel={
                isDescriptionExpanded
                  ? eventMeta.readLessDescriptionLabel
                  : eventMeta.readFullDescriptionLabel
              }
            />
            <EventSidebar
              dateRange={getDateRange(sessionGroups)}
              location={eventMeta.eventDetails?.venue}
            />
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-5xl px-4">
        <SessionTimeline groups={sessionGroups} onAction={handleSessionAction} />
      </div>
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
