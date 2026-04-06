const env = 'production'

export const config = {
  apiBaseUrl: 'https://gdg-portal-backend-623997941956.asia-east1.run.app/api',
  wsUrl: '',
  firebase: {
    projectId: 'gdg-mnl-portal',
    apiKey: 'AIzaSyDf1gNFyJAxsml08EpQthqf_LMoSWpbZbA',
  },
  env,
  isDev: false,
  viewSyncProvider: 'firebase',
  enableMockAuth: false,
}