import SessionCard from './SessionCard'
import FeedbackCTA from './FeedbackCTA'

function TimelineDot({ type }) {
  const borderColor = type === 'break' ? 'border-warning' : 'border-primary'

  return (
    <span
      aria-hidden="true"
      className={`absolute left-[6px] top-10 z-10 h-3 w-3 rounded-full border-2 bg-card ${borderColor}`}
    />
  )
}

export default function SessionTimeline({ groups = [], onAction, showFeedback = false }) {
  return (
    <section data-purpose="agenda-timeline">
      {groups.map((group) => (
        <div className="mb-14 last:mb-0" key={group.id}>
          <h2 className="mb-12 flex items-center gap-3 font-label text-lg font-bold uppercase tracking-label-extra-wide text-heading">
            <span>{group.dateLabel}</span>
            <span aria-hidden="true" className="text-muted">·</span>
            <span className="text-primary">{group.dayLabel}</span>
          </h2>

          <div className="relative">
            <div
              aria-hidden="true"
              className="absolute bottom-0 left-[11px] top-0 w-px border-l-2 border-dashed border-divider"
            />

            <div className="space-y-12">
              {group.sessions.map((session) => (
                <div className="relative pl-8" key={session.id}>
                  <TimelineDot type={session.type} />
                  <SessionCard onAction={onAction} session={session} />
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}

      {groups.length > 0 && showFeedback ? (
        <div className="relative mt-14">
          <div
            aria-hidden="true"
            className="absolute left-[11px] top-0 h-10 w-px border-l-2 border-dashed border-success/40"
          />
          <FeedbackCTA />
        </div>
      ) : null}
    </section>
  )
}
