import { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { LuCheck, LuChevronDown, LuMessageSquare, LuX } from 'react-icons/lu'
import { Popover } from '@/components/ui'
import { notificationsService } from '@/services/notifications'

const alertTones = [
  { value: 'info', label: 'Info' },
  { value: 'warning', label: 'Warning' },
  { value: 'urgent', label: 'Urgent' },
]

const toneClassNames = {
  info: 'border-primary/20 bg-primary/10 text-primary',
  warning: 'border-warning/20 bg-warning-bg text-warning',
  urgent: 'border-error/20 bg-error/10 text-error',
}

function TypePicker({ type, onSelect }) {
  const selectedTone = alertTones.find((option) => option.value === type) ?? alertTones[0]

  return (
    <Popover
      align="left"
      className="w-[min(14rem,calc(100vw-2rem))] p-3"
      trigger={(
        <button
          className="inline-flex h-11 min-w-[8.5rem] items-center justify-between gap-3 rounded-full border border-divider bg-card px-4 text-left text-heading transition hover:border-primary/30"
          type="button"
        >
          <span className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ${toneClassNames[selectedTone.value]}`}>
            {selectedTone.label}
          </span>
          <LuChevronDown aria-hidden="true" className="h-4 w-4 text-muted" />
        </button>
      )}
    >
      {({ close }) => (
        <div className="space-y-2">
          <div className="flex flex-col gap-2">
            {alertTones.map((option) => {
              const isSelected = option.value === type

              return (
                <button
                  className={`inline-flex w-full items-center justify-between gap-3 rounded-2xl border px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] transition ${
                    isSelected
                      ? toneClassNames[option.value]
                      : 'border-divider bg-card text-heading hover:border-primary/30 hover:text-primary'
                  }`.trim()}
                  key={option.value}
                  onClick={() => {
                    onSelect(option.value)
                    close()
                  }}
                  type="button"
                >
                  <span>{option.label}</span>
                  {isSelected ? <LuCheck aria-hidden="true" className="h-3.5 w-3.5" /> : null}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </Popover>
  )
}

export default function AlertsPage() {
  const { authEmail } = useOutletContext() ?? {}
  const [currentAlert, setCurrentAlert] = useState({ active: false })
  const [message, setMessage] = useState('')
  const [type, setType] = useState('info')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    let isMounted = true

    notificationsService.getCurrentAlert().then((nextAlert) => {
      if (isMounted) {
        setCurrentAlert(nextAlert)
      }
    })

    const unsubscribe = notificationsService.subscribe((nextAlert) => {
      if (isMounted) {
        setCurrentAlert(nextAlert)
      }
    })

    return () => {
      isMounted = false
      unsubscribe()
    }
  }, [])

  async function handleSubmit(event) {
    event.preventDefault()

    const normalizedMessage = String(message || '').trim()

    if (!normalizedMessage) {
      setError('Message is required.')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      await notificationsService.broadcastAlert(authEmail, normalizedMessage, type)
      setMessage('')
    } catch (submitError) {
      setError(submitError?.message || 'Unable to broadcast alert')
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleClearAlert() {
    if (!currentAlert?.active) {
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      await notificationsService.broadcastAlert(authEmail, '', currentAlert.type || 'info')
    } catch (submitError) {
      setError(submitError?.message || 'Unable to clear alert')
    } finally {
      setIsSubmitting(false)
    }
  }

  const currentToneClassName = toneClassNames[currentAlert?.type] ?? toneClassNames.info
  const currentToneLabel = alertTones.find((option) => option.value === currentAlert?.type)?.label ?? 'Info'

  return (
    <section className="space-y-4">
      <form className="space-y-3" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <TypePicker onSelect={setType} type={type} />

          <div className={`flex min-w-0 flex-1 items-center gap-3 rounded-[24px] border bg-card px-4 py-3 transition focus-within:border-primary ${
            error ? 'border-error' : 'border-divider'
          }`}>
            <LuMessageSquare aria-hidden="true" className="h-4 w-4 shrink-0 text-muted" />
            <input
              className="type-body w-full bg-transparent text-heading outline-none placeholder:text-muted"
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Enter broadcast message"
              value={message}
            />
          </div>

          <button
            className="inline-flex h-11 min-w-[9rem] items-center justify-center rounded-full bg-primary px-5 text-xs font-semibold uppercase tracking-[0.14em] text-card transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-70"
            disabled={isSubmitting || !authEmail}
            type="submit"
          >
            {isSubmitting ? 'Broadcasting…' : 'Broadcast'}
          </button>
        </div>

        {!authEmail ? (
          <p className="text-sm text-muted">Login is required to broadcast.</p>
        ) : null}

        {error ? <p className="text-sm text-error">{error}</p> : null}
      </form>

      {currentAlert?.active ? (
        <div className={`flex flex-wrap items-center gap-3 rounded-[20px] border px-4 py-3 ${currentToneClassName}`.trim()}>
          <span className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ${currentToneClassName}`.trim()}>
            {currentToneLabel}
          </span>
          <p className="min-w-0 flex-1 text-sm font-medium text-current">
            {currentAlert.message}
            {currentAlert.timestamp ? ` · Updated ${new Date(currentAlert.timestamp).toLocaleString()}` : ''}
          </p>
          <button
            aria-label="Clear broadcast"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-current/70 transition hover:bg-black/5 hover:text-current disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isSubmitting || !authEmail}
            onClick={handleClearAlert}
            type="button"
          >
            <LuX aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <p className="text-sm text-muted">No active broadcast</p>
      )}
    </section>
  )
}
