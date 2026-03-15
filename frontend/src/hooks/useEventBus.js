import { useEffect } from 'react'
import { on } from '@/lib/eventBus'

export function useEventBus(event, handler) {
  useEffect(() => on(event, handler), [event, handler])
}
