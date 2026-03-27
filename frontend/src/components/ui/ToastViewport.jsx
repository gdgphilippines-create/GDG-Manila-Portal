import { useEffect, useRef, useState } from 'react'
import { LuX } from 'react-icons/lu'
import { EVENT_BUS_EVENTS, on } from '@/lib/eventBus'
import { notificationsService } from '@/services/notifications'

const MAX_VISIBLE_TOASTS = 3
const TOAST_DURATION_MS = 5000
const TOAST_ENTER_DURATION_MS = 300
const TOAST_EXIT_DURATION_MS = 200

const toneDotClassNames = {
  info: 'bg-primary',
  urgent: 'bg-error',
  success: 'bg-success',
  warning: 'bg-warning',
  error: 'bg-error',
}

let audioContext = null

function getAudioContext() {
  if (typeof window === 'undefined') {
    return null
  }

  const AudioContextConstructor = window.AudioContext || window.webkitAudioContext

  if (!AudioContextConstructor) {
    return null
  }

  if (!audioContext) {
    audioContext = new AudioContextConstructor()
  }

  return audioContext
}

async function unlockToastAudio() {
  const context = getAudioContext()

  if (!context || context.state !== 'suspended') {
    return
  }

  await context.resume()
}

async function playToastSound() {
  const context = getAudioContext()

  if (!context) {
    return
  }

  if (context.state === 'suspended') {
    return
  }

  const startTime = context.currentTime + 0.01
  const endTime = startTime + 0.08
  const oscillator = context.createOscillator()
  const gainNode = context.createGain()

  oscillator.type = 'sine'
  oscillator.frequency.setValueAtTime(880, startTime)

  gainNode.gain.setValueAtTime(0.15, startTime)
  gainNode.gain.exponentialRampToValueAtTime(0.0001, endTime)

  oscillator.connect(gainNode)
  gainNode.connect(context.destination)

  oscillator.start(startTime)
  oscillator.stop(endTime)
}

function buildAlertKey(alert) {
  return [alert?.timestamp, alert?.type, alert?.message, alert?.createdBy].join('::')
}

function ToastCard({ toast, onDismiss }) {
  const timeoutIdRef = useRef(null)
  const startTimeRef = useRef(0)
  const remainingMsRef = useRef(TOAST_DURATION_MS)

  useEffect(() => {
    if (toast.stage === 'exiting') {
      return undefined
    }

    function scheduleDismiss(delayMs) {
      window.clearTimeout(timeoutIdRef.current)
      startTimeRef.current = Date.now()
      timeoutIdRef.current = window.setTimeout(() => {
        onDismiss(toast.id)
      }, delayMs)
    }

    scheduleDismiss(remainingMsRef.current)

    return () => {
      window.clearTimeout(timeoutIdRef.current)
    }
  }, [onDismiss, toast.id, toast.stage])

  function handleMouseEnter() {
    if (toast.stage === 'exiting') {
      return
    }

    window.clearTimeout(timeoutIdRef.current)
    remainingMsRef.current = Math.max(0, remainingMsRef.current - (Date.now() - startTimeRef.current))
  }

  function handleMouseLeave() {
    if (toast.stage === 'exiting' || remainingMsRef.current <= 0) {
      return
    }

    startTimeRef.current = Date.now()
    timeoutIdRef.current = window.setTimeout(() => {
      onDismiss(toast.id)
    }, remainingMsRef.current)
  }

  const isExiting = toast.stage === 'exiting'
  const isVisible = toast.stage === 'visible'

  return (
    <div
      className="pointer-events-auto flex h-12 min-w-[200px] max-w-[360px] w-fit items-center rounded-full bg-white pl-3 pr-3 shadow-[0_4px_12px_rgba(0,0,0,0.12)]"
      role="status"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateX(0)' : 'translateX(100%)',
        transitionDuration: `${isExiting ? TOAST_EXIT_DURATION_MS : TOAST_ENTER_DURATION_MS}ms`,
        transitionProperty: 'transform, opacity',
        transitionTimingFunction: isExiting ? 'ease-in' : 'ease-out',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <span
        aria-hidden="true"
        className={`h-2 w-2 shrink-0 rounded-full ${toneDotClassNames[toast.type] ?? toneDotClassNames.info}`.trim()}
      />
      <p className="min-w-0 flex-1 truncate px-3 text-[14px] font-medium leading-none text-heading">
        {toast.message}
      </p>
      <button
        aria-label="Dismiss notification"
        className="inline-flex h-5 w-5 shrink-0 items-center justify-center text-slate-400 transition-colors hover:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25"
        type="button"
        onClick={() => onDismiss(toast.id)}
      >
        <LuX aria-hidden="true" className="h-2 w-2" />
      </button>
    </div>
  )
}

export default function ToastViewport() {
  const [toasts, setToasts] = useState([])
  const latestAlertKeyRef = useRef('')
  const removalTimeoutsRef = useRef(new Map())
  const pendingSoundCountRef = useRef(0)

  useEffect(() => {
    const removalTimeouts = removalTimeoutsRef.current

    async function handleAudioUnlock() {
      try {
        await unlockToastAudio()
      } catch {
        return
      }

      if (pendingSoundCountRef.current <= 0) {
        return
      }

      pendingSoundCountRef.current = 0
      void playToastSound().catch(() => {})
    }

    window.addEventListener('pointerdown', handleAudioUnlock, { passive: true })
    window.addEventListener('keydown', handleAudioUnlock)

    function queueToast(notification) {
      if (!notification?.message) {
        return
      }

      const nextToast = {
        ...notification,
        id: notification.id || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        stage: 'entering',
      }

      setToasts((currentToasts) => {
        const nextToasts = [...currentToasts, nextToast].slice(-MAX_VISIBLE_TOASTS)
        return nextToasts
      })

      window.requestAnimationFrame(() => {
        setToasts((currentToasts) =>
          currentToasts.map((toast) =>
            toast.id === nextToast.id ? { ...toast, stage: 'visible' } : toast,
          ),
        )
      })

      void playToastSound()
        .then(() => {})
        .catch(() => {})

      const context = getAudioContext()

      if (context?.state === 'suspended') {
        pendingSoundCountRef.current += 1
      }
    }

    function syncAlert(alert) {
      if (!alert?.active || !alert.message) {
        return
      }

      const alertKey = buildAlertKey(alert)

      if (latestAlertKeyRef.current === alertKey) {
        return
      }

      latestAlertKeyRef.current = alertKey
      queueToast({
        id: `alert-${alertKey}`,
        message: alert.message,
        type: alert.type,
      })
    }

    notificationsService.getCurrentAlert().then(syncAlert)
    const unsubscribeAlerts = notificationsService.subscribe(syncAlert)
    const unsubscribeToasts = on(EVENT_BUS_EVENTS.NOTIFICATION_RECEIVED, queueToast)

    return () => {
      window.removeEventListener('pointerdown', handleAudioUnlock)
      window.removeEventListener('keydown', handleAudioUnlock)
      unsubscribeAlerts()
      unsubscribeToasts()
      removalTimeouts.forEach((timeoutId) => {
        window.clearTimeout(timeoutId)
      })
      removalTimeouts.clear()
    }
  }, [])

  function handleDismiss(id) {
    setToasts((currentToasts) =>
      currentToasts.map((toast) =>
        toast.id === id ? { ...toast, stage: 'exiting' } : toast,
      ),
    )

    const existingTimeoutId = removalTimeoutsRef.current.get(id)

    if (existingTimeoutId) {
      window.clearTimeout(existingTimeoutId)
    }

    const timeoutId = window.setTimeout(() => {
      removalTimeoutsRef.current.delete(id)
      setToasts((currentToasts) => currentToasts.filter((toast) => toast.id !== id))
    }, TOAST_EXIT_DURATION_MS)

    removalTimeoutsRef.current.set(id, timeoutId)
  }

  if (toasts.length === 0) {
    return null
  }

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed bottom-4 right-4 z-[9999] flex flex-col items-end gap-2"
    >
      {toasts.map((toast) => (
        <ToastCard key={toast.id} toast={toast} onDismiss={handleDismiss} />
      ))}
    </div>
  )
}
