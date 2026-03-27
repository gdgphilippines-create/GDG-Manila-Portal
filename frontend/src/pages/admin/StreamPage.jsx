import { adminActionsCopy } from '@/constants/admin'
import { VIEW_STATES } from '@/constants'
import { LuCircleOff, LuClock3, LuRadio } from 'react-icons/lu'
import { useOutletContext } from 'react-router-dom'
import { streamStatusClassNames } from '@/styles/theme'

const streamStatusIcons = {
  [VIEW_STATES.WAITING]: LuClock3,
  [VIEW_STATES.LIVE]: LuRadio,
  [VIEW_STATES.ENDED]: LuCircleOff,
}

const viewToToneKey = {
  [VIEW_STATES.WAITING]: 'waiting',
  [VIEW_STATES.LIVE]: 'live',
  [VIEW_STATES.ENDED]: 'ended',
}

export default function StreamPage() {
  const { currentView, error, isPending, updateView } = useOutletContext()

  return (
    <section className="space-y-4">
      <div className="inline-flex flex-wrap items-center gap-1.5 rounded-full border border-divider bg-card/60 p-1">
        {adminActionsCopy.map((action) => {
          const Icon = streamStatusIcons[action.view] ?? LuClock3
          const toneKey = viewToToneKey[action.view] ?? 'waiting'
          const tone = streamStatusClassNames[toneKey]
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
                <span className="inline-flex h-2 w-2 rounded-full bg-success animate-[pulse_1.5s_ease-in-out_infinite]" />
              ) : null}
            </button>
          )
        })}
      </div>
      {error ? <p className="type-body text-error">{error}</p> : null}
    </section>
  )
}
