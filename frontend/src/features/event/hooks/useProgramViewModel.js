import { useEffect, useReducer } from 'react'
import { createAsyncState, asyncReducer } from '@/lib/asyncState'
import { programCopy } from '../copy/programCopy'
import { eventPortalMeta } from '../data/portalMeta'
import { programSessions } from '../data/programSessions'

const initialData = {
  eventMeta: {
    ...eventPortalMeta,
    ...programCopy,
  },
  sessions: [],
}

export function useProgramViewModel() {
  const [state, dispatch] = useReducer(asyncReducer, createAsyncState(initialData))

  useEffect(() => {
    let isCancelled = false

    async function loadProgram() {
      dispatch({ type: 'FETCH_START' })

      try {
        const payload = await Promise.resolve({
          eventMeta: initialData.eventMeta,
          sessions: programSessions,
        })

        if (!isCancelled) {
          dispatch({ type: 'FETCH_SUCCESS', payload })
        }
      } catch (error) {
        if (!isCancelled) {
          dispatch({ type: 'FETCH_ERROR', payload: error.message })
        }
      }
    }

    loadProgram()

    return () => {
      isCancelled = true
    }
  }, [])

  return {
    eventMeta: state.data?.eventMeta ?? initialData.eventMeta,
    sessions: state.data?.sessions ?? [],
    status: state.status,
  }
}
