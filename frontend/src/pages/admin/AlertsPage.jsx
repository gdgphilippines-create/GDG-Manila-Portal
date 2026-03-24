import { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { LuBell, LuCheck, LuChevronDown, LuMessageSquare } from 'react-icons/lu'
import { GlassPanel, Popover } from '@/components/ui'
import { adminOverviewLabels } from '@/constants/admin'
import { notificationsService } from '@/services/notifications'

const alertTones = [
  { value: 'info', label: 'Info' },
  { value: 'success', label: 'Success' },
  { value: 'warning', label: 'Warning' },
]

const toneClassNames = {
  info: 'border-primary/20 bg-primary/10 text-primary',
  success: 'border-success/20 bg-success-bg text-success',
  warning: 'border-warning/20 bg-warning-bg text-warning',
}

function TypePicker({ type, onSelect }) {
  const selectedTone = alertTones.find((option) => option.value === type) ?? alertTones[0]

  return (
    <Popover
      align="left"
      className="w-64 p-3"
      trigger={(
        <button
          className="flex h-14 w-full items-center justify-between rounded-[16px] border border-divider bg-card px-4 text-left text-heading transition hover:border-primary/30"
          type="button"
        >
          <span className="flex items-center gap-3">
            <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] ${toneClassNames[selectedTone.value]}`}>
              {selectedTone.label}
            </span>
          </span>
          <LuChevronDown aria-hidden="true" className="h-4 w-4 text-muted" />
        </button>
      )}
    >
      {({ close }) => (
        <div className="space-y-2">
          <p className="font-label px-1 text-[12px] font-semibold uppercase tracking-[0.14em] text-muted">
            Banner Tone
          </p>
          <div className="flex flex-wrap gap-2">
            {alertTones.map((option) => {
              const isSelected = option.value === type

              return (
                <button
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] transition ${
                    isSelected
                      ? toneClassNames[option.value]
                      : 'border-divider bg-card text-heading hover:border-primary/30 hover:text-primary'
                  }`}
                  key={option.value}
                  onClick={() => {
                    onSelect(option.value)
                    close()
                  }}
                  type="button"
                >
                  {isSelected ? <LuCheck aria-hidden="true" className="h-3.5 w-3.5" /> : null}
                  <span>{option.label}</span>
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
  const messageLength = message.length

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

  return (
    <GlassPanel variant="card">
      <div className="px-6 py-6">
        <div>
          <h2 className="text-left font-sans text-[20px] font-semibold leading-7 text-heading">
            {adminOverviewLabels.alertsTitle}
          </h2>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(18rem,0.92fr)_minmax(0,1.08fr)]">
          <section className="rounded-[28px] border border-divider bg-card p-6 shadow-card">
            <p className="font-label text-[12px] font-semibold uppercase tracking-[0.14em] text-muted">
              Current Broadcast
            </p>

            {currentAlert?.active ? (
              <div className="mt-5 rounded-[24px] border border-divider bg-card p-5">
                <div className="flex items-center justify-between gap-3">
                  <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] ${toneClassNames[currentAlert.type] ?? toneClassNames.info}`}>
                    {alertTones.find((option) => option.value === currentAlert.type)?.label ?? 'Info'}
                  </span>
                </div>

                <p className="mt-5 text-[16px] font-medium leading-7 text-heading">
                  {currentAlert.message}
                </p>

                {currentAlert.timestamp ? (
                  <p className="mt-4 text-sm text-muted">
                    Updated {new Date(currentAlert.timestamp).toLocaleString()}
                  </p>
                ) : null}
              </div>
            ) : (
              <div className="mt-5 rounded-[24px] border border-dashed border-divider bg-footer/50 p-6 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-card">
                  <LuBell aria-hidden="true" className="h-6 w-6 text-muted" />
                </div>
                <p className="mt-4 text-[16px] font-medium leading-7 text-heading">
                  No active broadcast
                </p>
                <p className="mt-2 text-sm text-muted">
                  Publish a new alert from the editor to make it live.
                </p>
              </div>
            )}
          </section>

          <section className="rounded-[28px] border border-divider bg-card p-6">
            <p className="font-label text-[12px] font-semibold uppercase tracking-[0.14em] text-muted">
              Broadcast Editor
            </p>

            <form className="mt-5 grid gap-5" onSubmit={handleSubmit}>
              <label className="block">
                <span className="font-label text-[12px] font-semibold uppercase tracking-[0.14em] text-muted">
                  Type
                </span>
                <div className="mt-2.5">
                  <TypePicker onSelect={setType} type={type} />
                </div>
              </label>

              <label className="block">
                <span className="font-label text-[12px] font-semibold uppercase tracking-[0.14em] text-muted">
                  Message
                </span>
                <div className="relative mt-2.5">
                  <div className={`rounded-[20px] border bg-card px-4 pb-9 pt-4 transition focus-within:border-primary ${
                    error ? 'border-error' : 'border-divider'
                  }`}>
                    <div className="mb-2 flex items-center gap-3 text-muted">
                      <LuMessageSquare aria-hidden="true" className="h-4 w-4 shrink-0" />
                      <span className="text-sm font-medium">Broadcast message</span>
                    </div>
                    <textarea
                      className="min-h-36 w-full resize-y bg-transparent text-sm leading-6 text-heading outline-none placeholder:text-muted"
                      onChange={(event) => setMessage(event.target.value)}
                      placeholder="Enter broadcast message"
                      value={message}
                    />
                    <span className="pointer-events-none absolute bottom-4 right-4 text-xs font-medium text-muted">
                      {messageLength}
                    </span>
                  </div>
                </div>
                {error ? <p className="mt-2 text-sm text-error">{error}</p> : null}
              </label>

              <div className="flex flex-wrap items-center justify-end gap-3">
                {!authEmail ? (
                  <p className="text-sm text-muted">Login is required to broadcast.</p>
                ) : null}
                <button
                  className="inline-flex min-w-36 items-center justify-center rounded-[24px] bg-primary px-6 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-card transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-70"
                  disabled={isSubmitting || !authEmail}
                  type="submit"
                >
                  {isSubmitting ? 'Broadcasting…' : 'Broadcast'}
                </button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </GlassPanel>
  )
}
