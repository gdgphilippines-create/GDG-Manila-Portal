import { on } from '@/lib/eventBus'

const NO_PAYLOAD = Symbol('no-payload')

export function createPollingSubscription({
  event,
  onChange,
  pollIntervalMs,
  read,
  normalize = (value) => value,
}) {
  if (typeof window === 'undefined') {
    return () => {}
  }

  const sync = async (nextValue = NO_PAYLOAD) => {
    if (nextValue !== NO_PAYLOAD) {
      onChange(normalize(nextValue))
      return
    }

    try {
      onChange(await read())
    } catch {
      // Keep
    }
  }

  const unsubscribeBus = on(event, sync)
  const intervalId = window.setInterval(() => {
    void sync()
  }, pollIntervalMs)

  return () => {
    unsubscribeBus()
    window.clearInterval(intervalId)
  }
}
