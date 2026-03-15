export function createAsyncState(data = null) {
  return {
    status: 'idle',
    data,
    error: null,
  }
}

export function asyncReducer(state, action) {
  switch (action.type) {
    case 'FETCH_START':
      return {
        ...state,
        status: 'loading',
        error: null,
      }
    case 'FETCH_SUCCESS':
      return {
        status: 'success',
        data: action.payload,
        error: null,
      }
    case 'FETCH_ERROR':
      return {
        status: 'error',
        data: state.data,
        error: action.payload,
      }
    case 'RESET':
      return createAsyncState()
    default:
      return state
  }
}
