import { config } from '@/lib/config'
import { ApiError, AuthError, NetworkError } from '@/lib/errors'

export async function apiRequest(path, options = {}) {
  const url = path.startsWith('http') ? path : `${config.apiBaseUrl}${path}`
  const headers = new Headers(options.headers || {})

  headers.set('Content-Type', 'application/json')

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
