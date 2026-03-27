import { adminActionsCopy } from '@/constants/admin'
import { VIEW_STATES } from '@/constants'
import { LuCircleOff, LuClock3, LuRadio } from 'react-icons/lu'
import { useOutletContext } from 'react-router-dom'

const streamStatusIcons = {
  [VIEW_STATES.WAITING]: LuClock3,
  [VIEW_STATES.LIVE]: LuRadio,
  [VIEW_STATES.ENDED]: LuCircleOff,
}

const streamStatusClassNames = {
  [VIEW_STATES.WAITING]: {
    active: 'border-slate-300 bg-slate-100 text-slate-700',
    inactive: 'border-transparent bg-transparent text-slate-500 hover:text-slate-700',
  },
  [VIEW_STATES.LIVE]: {
    active: 'border-emerald-300 bg-emerald-100 text-emerald-800',
    inactive: 'border-transparent bg-transparent text-slate-500 hover:text-emerald-700',
  },
  [VIEW_STATES.ENDED]: {
    active: 'border-rose-300 bg-rose-100 text-rose-700',
    inactive: 'border-transparent bg-transparent text-slate-500 hover:text-rose-700',
  },
}

export default function StreamPage() {
  const { currentView, error, isPending, updateView } = useOutletContext()

  return (
    <section className="space-y-4">
      <div className="inline-flex flex-wrap items-center gap-1.5 rounded-full border border-divider bg-card/60 p-1">
        {adminActionsCopy.map((action) => {
          const Icon = streamStatusIcons[action.view] ?? LuClock3
          const tone = streamStatusClassNames[action.view] ?? streamStatusClassNames[VIEW_STATES.WAITING]
          const isActive = action.view === currentView

          return (
            <button
              aria-pressed={isActive}
              className={`inline-flex h-10 items-center gap-2 rounded-full border px-4 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60 ${
                isActive ? tone.active : tone.inactive
              }`.trim()}
              disabled={isPending}
              key={action.view}
              onClick={() => updateView(action.view)}
              type="button"
            >
              <Icon aria-hidden="true" className="h-4 w-4" />
              <span>{action.label}</span>
              {isActive && action.view === VIEW_STATES.LIVE ? (
                <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500 animate-[pulse_1.5s_ease-in-out_infinite]" />
              ) : null}
            </button>
          )
        })}
      </div>
      {error ? <p className="type-body text-error">{error}</p> : null}
    </section>
  )
}
