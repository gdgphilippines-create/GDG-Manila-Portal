import { config } from '@/lib/config'
import { ApiError, AuthError, NetworkError } from '@/lib/errors'
import { initializeApp, getApps, getApp } from 'firebase/app' // <-- NEW IMPORTS
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// 1. Set up the config using the variables we saved earlier
const firebaseConfig = {
  apiKey: config.firebase.apiKey,
  authDomain: `${config.firebase.projectId}.firebaseapp.com`,
  projectId: config.firebase.projectId,
}

// 2. If Firebase isn't awake yet, wake it up. Otherwise, use the existing connection.
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()
const auth = getAuth(app)
export const db = getFirestore(app)

export async function apiRequest(path, options = {}) {
  const url = path.startsWith('http') ? path : `${config.apiBaseUrl}${path}`
  const headers = new Headers(options.headers || {})

  headers.set('Content-Type', 'application/json')
  headers.set('x-device-id', localStorage.getItem('gdg_device_id') || '')

  // --- Attach Firebase Security Token ---
  try {
    await auth.authStateReady() 

    if (auth.currentUser) {
      console.log("✅ Firebase User Found! Attaching token to request.")
      const token = await auth.currentUser.getIdToken()
      headers.set('Authorization', `Bearer ${token}`)
    } else {
      console.warn("⚠️ Firebase user is NULL! Sending request without a token.")
    }
  } catch (error) {
    console.error("❌ Error with Firebase Auth:", error.message)
  }
  // -------------------------------------------

  if (config.isDev) {
    console.info('[api]', options.method || 'GET', url)
  }

  let response

  try {
    response = await fetch(url, {
      ...options,
      headers,
    })
  } catch (error) {
    throw new NetworkError('Unable to reach the API', { cause: error })
  }

  const contentType = response.headers.get('content-type') || ''
  const payload = contentType.includes('application/json')
    ? await response.json()
    : await response.text()

  if (!response.ok) {
    const message =
      typeof payload === 'object' && payload !== null
        ? payload.message || payload.error || 'Request failed'
        : 'Request failed'

    if (response.status === 401 || response.status === 403) {
      throw new AuthError(message, { status: response.status })
    }

    throw new ApiError(message, {
      status: response.status,
      code: typeof payload === 'object' && payload !== null ? payload.code : 'api_error',
    })
  }

  return payload
}