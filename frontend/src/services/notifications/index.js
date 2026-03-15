import { config } from '@/lib/config'

export const notificationsService = {
  async initialize() {
    if (config.isDev) {
      console.info('[notifications] initialize stub')
    }
  },
}
