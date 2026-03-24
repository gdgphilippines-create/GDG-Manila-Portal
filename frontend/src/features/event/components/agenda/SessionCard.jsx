import {
  LuCirclePlay,
  LuEye,
  LuMapPin,
  LuUserRound,
} from 'react-icons/lu'
import { programCopy } from '@/constants/program'
import { getSessionTypeLabel, normalizeSession } from '@/lib/programSessionUtils'

function SessionActionButton({ action, label, onAction }) {
  const isPrimary = action.variant === 'primary'
  const isSlidesAction = action.labelKey === 'slides'
  const Icon = action.icon === 'eye' ? LuEye : LuCirclePlay
  const className = isPrimary
    ? 'inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-xs font-bold text-card transition hover:brightness-95'
    : isSlidesAction
      ? 'inline-flex items-center gap-2 rounded-full bg-primary/10 px-6 py-2.5 text-xs font-bold text-primary transition hover:bg-primary/15'
      : 'inline-flex items-center gap-2 rounded-full bg-footer px-6 py-2.5 text-xs font-bold text-muted transition hover:bg-slate-200'

  return (
    <button
      className={className}
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
      className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-xs font-bold text-card transition hover:brightness-95"
      onClick={() => onAction?.(action, label)}
      type="button"
    >
      {label}
    </button>
  )
}

export default function SessionCard({ onAction, session }) {
  const normalizedSession = normalizeSession(session)
  const timeLabel = `${normalizedSession.schedule.startTime} - ${normalizedSession.schedule.endTime}`

  if (normalizedSession.type === 'break') {
    const action = normalizedSession.actions?.[0]
    const label = action ? programCopy.actionLabels[action.labelKey] : null

    return (
      <article className="rounded-[28px] border border-dashed border-warning/30 bg-warning-bg/90 p-8">
        <span className="font-label text-xs font-semibold uppercase tracking-[0.14em] text-warning">
          {timeLabel}
        </span>
        <h3 className="mt-2 text-2xl font-bold text-heading">{normalizedSession.title}</h3>
        {normalizedSession.description ? (
          <p className="mt-3 max-w-2xl text-sm leading-6 text-body">{normalizedSession.description}</p>
        ) : null}
        {action && label ? (
          <div className="mt-6">
            <BreakActionButton action={action} label={label} onAction={onAction} />
          </div>
        ) : null}
      </article>
    )
  }

  return (
    <article className="rounded-[28px] border border-divider bg-card p-8">
      <span className="font-label text-xs font-semibold uppercase tracking-[0.14em] text-primary">
        {timeLabel}
      </span>
      <h3 className="mt-2 text-2xl font-bold text-heading">{normalizedSession.title}</h3>

      <div className="mt-2.5 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-footer px-3 py-0.5 text-xs font-semibold uppercase tracking-[0.14em] text-heading">
          {getSessionTypeLabel(normalizedSession)}
        </span>
      </div>

      <div className="mb-6 mt-3 space-y-2.5">
        {normalizedSession.speakerName ? (
          <div className="flex items-center gap-2 text-sm leading-5 text-body">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-success-bg">
              <LuUserRound aria-hidden="true" className="h-4 w-4 text-success" />
            </div>
            <span>
              {normalizedSession.speakerName}
              {normalizedSession.speakerRole ? ` · ${normalizedSession.speakerRole}` : ''}
            </span>
          </div>
        ) : null}

        {normalizedSession.description ? (
          <p className="max-w-2xl text-sm leading-6 text-body">
            {normalizedSession.description}
          </p>
        ) : null}

        {normalizedSession.venue ? (
          <div className="flex items-center gap-2 text-sm leading-5 text-muted">
            <LuMapPin aria-hidden="true" className="h-4 w-4" />
            <span>{normalizedSession.venue}</span>
          </div>
        ) : null}
      </div>

      {normalizedSession.actions?.length ? (
        <div className="flex flex-wrap gap-4">
          {normalizedSession.actions.map((action) => (
            <SessionActionButton
              action={action}
              key={action.id}
              label={programCopy.actionLabels[action.labelKey]}
              onAction={onAction}
            />
          ))}
        </div>
      ) : null}
    </article>
  )
}
