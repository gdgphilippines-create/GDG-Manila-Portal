import { useEffect, useState } from 'react'
import { LuBell } from 'react-icons/lu'
import {
  notificationsService,
} from '@/services/notifications'

const toneClassNames = {
  info: 'border-primary/25 bg-primary/10 text-primary',
  success: 'border-success/20 bg-success-bg/85 text-success',
  warning: 'border-warning/20 bg-warning-bg text-warning',
}

const messageToneClassNames = {
  info: 'text-primary',
  success: 'text-success',
  warning: 'text-warning',
}

export default function AlertBanner() {
  const [activeAlert, setActiveAlert] = useState(null)

  useEffect(() => {
    let isMounted = true

    function syncAlert(alert) {
      if (!isMounted) {
        return
      }

      setActiveAlert(alert?.active ? alert : null)
    }

    notificationsService.getCurrentAlert().then(syncAlert)
    const unsubscribe = notificationsService.subscribe(syncAlert)

    return () => {
      isMounted = false
      unsubscribe()
    }
  }, [])

  if (!activeAlert) {
    return null
  }

  return (
    <div className={`mb-6 rounded-[12px] border px-6 py-4 ${toneClassNames[activeAlert.type] ?? toneClassNames.info}`} role="status">
      <div className="flex items-center gap-3">
        <div className="flex h-5 w-5 shrink-0 items-center justify-center">
          <LuBell aria-hidden="true" className={`h-4 w-4 ${messageToneClassNames[activeAlert.type] ?? messageToneClassNames.info}`} />
        </div>
        <div className="min-w-0">
          <p className={`text-left text-[14px] font-medium leading-6 ${messageToneClassNames[activeAlert.type] ?? messageToneClassNames.info}`}>
            {activeAlert.message}
          </p>
        </div>
      </div>
    </div>
  )
}
