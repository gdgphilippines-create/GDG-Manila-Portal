import { useRef, useState } from 'react'
import { LuChevronDown } from 'react-icons/lu'
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
  const scheduleSectionRef = useRef(null)

  function handleReadMore() {
    setIsDescriptionExpanded((value) => !value)
  }

  function handleScrollToSchedule() {
    scheduleSectionRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
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

      {sessionGroups.length > 0 ? (
        <section className="mx-auto w-full max-w-5xl px-4 pt-10 md:pt-12">
          <div className="flex justify-center pt-5 md:pt-6">
            <button
              aria-label="Scroll to schedule"
              className="inline-flex items-center justify-center text-slate-400 transition hover:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25"
              onClick={handleScrollToSchedule}
              type="button"
            >
              <LuChevronDown aria-hidden="true" className="h-5 w-5" />
            </button>
          </div>

          <div className="pt-14 md:pt-16" ref={scheduleSectionRef}>
            <SessionTimeline
              groups={sessionGroups}
              onAction={handleSessionAction}
              showFeedback={eventMeta.showFeedback}
            />
          </div>
        </section>
      ) : null}
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
