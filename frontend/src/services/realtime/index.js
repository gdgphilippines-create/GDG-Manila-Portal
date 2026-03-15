import { config } from '../../lib/config'

export function createRealtimeService() {
  return {
    connect() {
      if (config.isDev) {
        console.info('[realtime] connect stub', config.wsUrl)
      }
    },
    disconnect() {
      if (config.isDev) {
        console.info('[realtime] disconnect stub')
      }
    },
  }
}

export const realtimeService = createRealtimeService()
