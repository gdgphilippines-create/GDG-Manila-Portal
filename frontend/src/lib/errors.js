export class ApiError extends Error {
  constructor(message, { status = 500, code = 'api_error', cause } = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
    this.cause = cause
  }
}

export class NetworkError extends Error {
  constructor(message = 'Network request failed', options = {}) {
    super(message)
    this.name = 'NetworkError'
    this.code = options.code || 'network_error'
    this.cause = options.cause
  }
}

export class AuthError extends ApiError {
  constructor(message = 'Authentication required', options = {}) {
    super(message, {
      status: options.status || 401,
      code: options.code || 'auth_error',
      cause: options.cause,
    })
    this.name = 'AuthError'
  }
}
