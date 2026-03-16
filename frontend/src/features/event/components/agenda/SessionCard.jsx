import { LuBot, LuCirclePlay, LuEye, LuMapPin, LuUserRound } from 'react-icons/lu'
import { programCopy } from '../../copy/programCopy'

function RobotIllustration() {
  return (
    <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-footer md:h-28 md:w-28">
      <LuBot aria-hidden="true" className="h-12 w-12 text-muted/40" strokeWidth={1.75} />
    </div>
  )
}

function SessionActionButton({ action, label, onAction }) {
  const isPrimary = action.variant === 'primary'
  const Icon = action.icon === 'eye' ? LuEye : LuCirclePlay

  return (
    <button
      className={
        isPrimary
          ? 'inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-xs font-bold text-card transition hover:brightness-95'
          : 'inline-flex items-center gap-2 rounded-lg border border-divider px-6 py-2.5 text-xs font-bold text-muted transition hover:bg-footer'
      }
      onClick={() => onAction?.(action, label)}
      type="button"
    >
      <Icon />
      <span>{label}</span>
    </button>
  )
}

function BreakActionButton({ action, label, onAction }) {
  return (
    <button
      className="inline-flex rounded-lg border border-warning/30 bg-warning px-8 py-2.5 text-xs font-bold text-card transition hover:bg-warning/90"
      onClick={() => onAction?.(action, label)}
      type="button"
    >
      {label}
    </button>
  )
}

export default function SessionCard({ onAction, session }) {
  const timeLabel = `${session.schedule.startTime} - ${session.schedule.endTime}`

  if (session.type === 'break') {
    const action = session.actions?.[0]
    const label = action ? programCopy.actionLabels[action.labelKey] : null

    return (
      <article className="rounded-[28px] border border-dashed border-warning/30 bg-warning-bg/90 p-8">
        <span className="font-label text-xs font-semibold uppercase tracking-[0.14em] text-warning">
          {timeLabel}
        </span>
        <h3 className="mt-2 text-2xl font-bold text-heading">{session.title}</h3>
        {action && label ? (
          <div className="mt-6">
            <BreakActionButton action={action} label={label} onAction={onAction} />
          </div>
        ) : null}
      </article>
    )
  }

  return (
    <article className="flex flex-col justify-between rounded-[28px] border border-divider bg-card p-8 shadow-sm transition-shadow hover:shadow-md md:flex-row">
      <div className="flex-1">
        <span className="font-label text-xs font-semibold uppercase tracking-[0.14em] text-primary">
          {timeLabel}
        </span>
        <h3 className="mt-2 text-2xl font-bold text-heading">{session.title}</h3>

        <div className="mb-8 mt-4 space-y-3">
          {session.speakerName ? (
            <div className="flex items-center gap-2 text-sm text-body">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-success-bg">
                <LuUserRound aria-hidden="true" className="h-4 w-4 text-success" />
              </div>
              <span>{session.speakerName}</span>
            </div>
          ) : null}

          {session.venue ? (
            <div className="flex items-center gap-2 text-sm text-muted">
              <LuMapPin aria-hidden="true" className="h-4 w-4" />
              <span>{session.venue}</span>
            </div>
          ) : null}
        </div>

        {session.actions?.length ? (
          <div className="flex flex-wrap gap-4">
            {session.actions.map((action) => (
              <SessionActionButton
                action={action}
                key={action.id}
                label={programCopy.actionLabels[action.labelKey]}
                onAction={onAction}
              />
            ))}
          </div>
        ) : null}
      </div>

      <div className="mt-8 flex items-center justify-center md:ml-8 md:mt-0">
        {session.illustration === 'robot' ? <RobotIllustration /> : null}
      </div>
    </article>
  )
}
