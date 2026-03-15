import { config } from '@/lib/config'

export function track(eventName, payload = {}) {
  if (config.isDev) {
    console.info('[analytics]', eventName, payload)
  }
}
