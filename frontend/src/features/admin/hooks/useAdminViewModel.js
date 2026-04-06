import { useReducer } from 'react'
import { executeAction } from '@/services/view-sync/actions'
import { createAsyncState, asyncReducer } from '@/lib/asyncState'
import { useActiveView } from '@/services/view-sync/useActiveView'

export function useAdminViewModel() {
  const [actionState, dispatch] = useReducer(asyncReducer, createAsyncState())
  const {
    activeView,
    status: syncStatus,
    error: syncError,
  } = useActiveView()

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
    currentView: activeView,
    updateView,
    isPending: syncStatus === 'loading' || actionState.status === 'loading',
    error: actionState.error ?? syncError,
    actionStatus: actionState.status,
    syncStatus,
  }
}
