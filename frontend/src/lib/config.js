const env = import.meta.env.VITE_ENV || import.meta.env.MODE || 'development'

export const config = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || '/api',
  wsUrl: import.meta.env.VITE_WS_URL || '',
  firebase: {
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  },
  env,
  isDev: env !== 'production',
  viewSyncProvider: import.meta.env.VITE_VIEW_SYNC_PROVIDER || 'local-storage',
  enableMockAuth: import.meta.env.VITE_ENABLE_MOCK_AUTH !== 'false',
}
