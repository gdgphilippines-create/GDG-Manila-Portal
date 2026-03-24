import { LuCircleOff, LuClock3, LuRadio } from 'react-icons/lu'
import { VIEW_STATES } from '@/constants'

const actionIcons = {
  [VIEW_STATES.WAITING]: LuClock3,
  [VIEW_STATES.LIVE]: LuRadio,
  [VIEW_STATES.ENDED]: LuCircleOff,
}

const toneClassNames = {
  [VIEW_STATES.WAITING]: {
    active: 'border-primary/35 bg-primary/12 text-primary shadow-[0_1px_2px_rgba(66,133,244,0.12)]',
    inactive: 'border-transparent bg-primary/8 text-primary/80',
    icon: 'bg-primary/12 text-primary',
  },
  [VIEW_STATES.LIVE]: {
    active: 'border-success/35 bg-success-bg text-success shadow-[0_1px_2px_rgba(52,168,83,0.12)]',
    inactive: 'border-transparent bg-success-bg/70 text-success/80',
    icon: 'bg-success/10 text-success',
  },
  [VIEW_STATES.ENDED]: {
    active: 'border-divider bg-slate-50 text-slate-600 shadow-[0_1px_2px_rgba(15,23,42,0.06)]',
    inactive: 'border-transparent bg-slate-50 text-slate-500',
    icon: 'bg-card text-slate-500',
  },
}

export default function ActionButton({ action, active = false, disabled, onSelect }) {
  const Icon = actionIcons[action.view] ?? LuClock3
  const tones = toneClassNames[action.view] ?? toneClassNames[VIEW_STATES.WAITING]
  const containerClassName = active ? tones.active : tones.inactive
  const iconClassName = tones.icon

  return (
    <button
      aria-pressed={active}
      className={`relative flex min-h-[92px] items-center justify-center rounded-[20px] border px-4 py-4 text-center transition duration-200 disabled:cursor-not-allowed disabled:opacity-60 ${containerClassName}`}
      disabled={disabled}
      onClick={() => onSelect(action.view)}
      title={action.label}
      type="button"
    >
      <span className="flex flex-col items-center justify-center gap-2">
        <span className={`inline-flex h-11 w-11 items-center justify-center rounded-full ${iconClassName}`}>
          <Icon aria-hidden="true" className="h-5 w-5" />
        </span>
        <span className="font-sans text-[14px] font-medium leading-5 text-current">
          {action.label}
        </span>
      </span>
      {active && action.view === VIEW_STATES.LIVE ? (
        <span className="absolute right-4 top-4 inline-flex h-2.5 w-2.5 rounded-full bg-success animate-[pulse_1.5s_ease-in-out_infinite]" />
      ) : null}
      {active && action.view !== VIEW_STATES.LIVE ? (
        <span className="absolute inset-0 rounded-[20px] ring-1 ring-inset ring-current/10" />
      ) : null}
      {disabled ? (
        <span className="sr-only">Updating status</span>
      ) : null}
    </button>
  )
}
