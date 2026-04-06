import { Suspense, useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import AdminSection from './components/AdminSection'
import { DEFAULT_ADMIN_TAB } from './constants'
import {
  adminOverviewLabels,
  getAdminStatusPill,
} from '@/constants/admin'
import { useAdminViewModel } from './hooks/useAdminViewModel'
import { getDefaultProgramState, programService } from '@/services/program'

export default function AdminScreen({ authEmail = '' }) {
  const { currentView, updateView, isPending, error } = useAdminViewModel()
  const currentStatus = getAdminStatusPill(currentView, isPending)
  const location = useLocation()
  const defaultProgramState = getDefaultProgramState()
  const [eventDraft, setEventDraft] = useState(defaultProgramState.eventDraft)
  const [sessions, setSessions] = useState(defaultProgramState.sessions)
  const [programError, setProgramError] = useState(null)
  const activeTab = location.pathname.split('/').filter(Boolean).at(-1) ?? DEFAULT_ADMIN_TAB

  useEffect(() => {
    let isMounted = true

    programService.get()
      .then((nextProgram) => {
        if (!isMounted) {
          return
        }

        setEventDraft(nextProgram.eventDraft)
        setSessions(nextProgram.sessions)
        setProgramError(null)
      })
      .catch((nextError) => {
        if (isMounted) {
          setProgramError(nextError.message)
        }
      })

    const unsubscribe = programService.subscribe((nextProgram) => {
      if (!isMounted) {
        return
      }

      setEventDraft(nextProgram.eventDraft)
      setSessions(nextProgram.sessions)
      setProgramError(null)
    })

    return () => {
      isMounted = false
      unsubscribe()
    }
  }, [])

  async function saveEventDraft(nextEventDraft) {
    try {
      const savedProgram = await programService.save({
        eventDraft: nextEventDraft,
      }, { email: authEmail })

      setEventDraft(savedProgram.eventDraft)
      setSessions(savedProgram.sessions)
      setProgramError(null)
      return savedProgram
    } catch (nextError) {
      setProgramError(nextError.message)
      return null
    }
  }

  async function saveSessions(nextSessions) {
    try {
      const savedProgram = await programService.save({
        sessions: nextSessions,
      }, { email: authEmail })

      setEventDraft(savedProgram.eventDraft)
      setSessions(savedProgram.sessions)
      setProgramError(null)
      return savedProgram
    } catch (nextError) {
      setProgramError(nextError.message)
      return null
    }
  }

  return (
    <AdminSection
      activeTab={activeTab}
      currentStatus={currentStatus}
      event={{
        eventName: eventDraft.title,
        date: eventDraft.date,
        location: eventDraft.location,
      }}
      labels={adminOverviewLabels}
    >
      <Suspense fallback={<p className="type-body text-muted">Loading section...</p>}>
        <Outlet
          context={{
            authEmail,
            currentStatus,
            currentView,
            error,
            eventDraft,
            isPending,
            programError,
            sessions,
            saveEventDraft,
            saveSessions,
            setEventDraft,
            setSessions,
            updateView,
          }}
        />
      </Suspense>
    </AdminSection>
  )
}
