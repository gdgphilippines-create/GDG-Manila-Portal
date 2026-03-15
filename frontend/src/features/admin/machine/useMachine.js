import { useReducer } from 'react'
import { executeAction } from '../../../api/admin'
import { createAsyncState, asyncReducer } from '../../../lib/asyncState'

export function useMachine() {
  const [state, dispatch] = useReducer(asyncReducer, createAsyncState())

  const updateView = async (view) => {
    dispatch({ type: 'FETCH_START' })

    try {
      await executeAction(view)
      dispatch({ type: 'FETCH_SUCCESS', payload: view })
    } catch (error) {
      dispatch({ type: 'FETCH_ERROR', payload: error.message })
    }
  }

  return {
    updateView,
    status: state.status,
    error: state.error,
  }
}
