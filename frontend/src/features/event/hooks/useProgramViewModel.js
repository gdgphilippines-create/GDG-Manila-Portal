import { useEffect, useReducer } from 'react'
import { createAsyncState, asyncReducer } from '@/lib/asyncState'
import { eventPortalMeta } from '../data/portalMeta'
import {
  buildProgramEventMeta,
  getDefaultProgramState,
  programService,
} from '@/services/program'

function toProgramViewModel(programState) {
  return {
    eventMeta: {
      ...eventPortalMeta,
      ...buildProgramEventMeta(programState.eventDraft),
    },
    sessions: programState.sessions,
  }
}

const initialData = toProgramViewModel(getDefaultProgramState())

export function useProgramViewModel() {
  const [state, dispatch] = useReducer(asyncReducer, createAsyncState(initialData))

  useEffect(() => {
    let isCancelled = false

    async function loadProgram() {
      dispatch({ type: 'FETCH_START' })

      try {
        const payload = toProgramViewModel(await programService.get())

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

    const unsubscribe = programService.subscribe((nextProgramState) => {
      if (!isCancelled) {
        dispatch({ type: 'FETCH_SUCCESS', payload: toProgramViewModel(nextProgramState) })
      }
    })

    return () => {
      isCancelled = true
      unsubscribe()
    }
  }, [])

  return {
    eventMeta: state.data?.eventMeta ?? initialData.eventMeta,
    sessions: state.data?.sessions ?? [],
    status: state.status,
  }
}
