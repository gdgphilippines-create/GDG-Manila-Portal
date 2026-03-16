import { useEffect, useReducer } from 'react'
import { VIEW_STATES } from '@/core/constants'
import { createAsyncState, asyncReducer } from '@/lib/asyncState'
import { getActiveViewState, subscribeToView } from '@/api/views'

export function useActiveView() {
  const [state, dispatch] = useReducer(
    asyncReducer,
    createAsyncState(VIEW_STATES.LOADING),
  )

  useEffect(() => {
    let mounted = true

    dispatch({ type: 'FETCH_START' })

    getActiveViewState()
      .then((activeView) => {
        if (mounted) {
          dispatch({ type: 'FETCH_SUCCESS', payload: activeView })
        }
      })
      .catch((error) => {
        if (mounted) {
          dispatch({ type: 'FETCH_ERROR', payload: error.message })
        }
      })

    const unsubscribe = subscribeToView((nextView) => {
      dispatch({ type: 'FETCH_SUCCESS', payload: nextView })
    })

    return () => {
      mounted = false
      unsubscribe()
    }
  }, [])

  return {
    activeView: state.data ?? VIEW_STATES.LOADING,
    status: state.status,
    error: state.error,
  }
}
