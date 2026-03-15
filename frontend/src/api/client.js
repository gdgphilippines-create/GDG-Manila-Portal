import { config } from '@/lib/config'
import { ApiError, AuthError, NetworkError } from '@/lib/errors'

const authTokenStorageKey = 'gdg-manila-auth-token'

function getStoredToken() {
  if (typeof window === 'undefined') {
    return ''
  }

  return window.localStorage.getItem(authTokenStorageKey) || ''
}

export function setStoredToken(token) {
  if (typeof window === 'undefined') {
    return
  }

  if (token) {
    window.localStorage.setItem(authTokenStorageKey, token)
    return
  }

  window.localStorage.removeItem(authTokenStorageKey)
}

export async function apiRequest(path, options = {}) {
  const url = path.startsWith('http') ? path : `${config.apiBaseUrl}${path}`
  const headers = new Headers(options.headers || {})
  const token = getStoredToken()

  headers.set('Content-Type', 'application/json')

  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

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
      typeof payload === 'object' && payload !== null ? payload.message : 'Request failed'

    if (response.status === 401) {
      throw new AuthError(message, { status: response.status })
    }

    throw new ApiError(message, {
      status: response.status,
      code: typeof payload === 'object' && payload !== null ? payload.code : 'api_error',
    })
  }

  return payload
}
