import { useEffect, useState } from 'react'
import { LuPencil, LuPlus } from 'react-icons/lu'
import { GlassPanel } from '@/components/ui'
import { surfacePatterns } from '@/styles/layout'
import { useOutletContext } from 'react-router-dom'
import EventDetailEditorCard from '@/features/admin/components/event/EventDetailEditorCard'
import SessionForm from '@/features/admin/components/program/SessionForm'
import {
  emptySession,
  getSessionTypeLabel,
  normalizeSession,
  sortSessions,
  summarizeSession,
} from '@/features/admin/components/program/sessionFormUtils'

export default function ProgramManagePage() {
  const {
    eventDraft,
    programError,
    saveEventDraft,
    saveSessions,
    sessions,
  } = useOutletContext()
  const [addingNew, setAddingNew] = useState(false)
  const [editingSessionId, setEditingSessionId] = useState(null)
  const [newSession, setNewSession] = useState(emptySession())
  const [editingDraft, setEditingDraft] = useState(null)
  const [eventEditDraft, setEventEditDraft] = useState(eventDraft)

  useEffect(() => {
    setEventEditDraft(eventDraft)
  }, [eventDraft])

  function handleAddSession() {
    setAddingNew(true)
    setEditingSessionId(null)
    setEditingDraft(null)
    setNewSession(normalizeSession(emptySession()))
  }

  async function handleSaveNewSession(session) {
    const savedProgram = await saveSessions(
      sortSessions([...sessions, normalizeSession(session)]),
    )

    if (!savedProgram) {
      return
    }

    setAddingNew(false)
    setNewSession(emptySession())
  }

  async function handleDeleteSession(sessionId) {
    void sessionId
  }

  async function handleSaveSession(sessionId) {
    if (!editingDraft) {
      return
    }

    const nextSessions = sortSessions(
      sessions.map((session) => (
        session.id === sessionId ? normalizeSession(editingDraft) : session
      )),
    )
    const savedProgram = await saveSessions(nextSessions)

    if (!savedProgram) {
      return
    }

    setEditingSessionId(null)
    setEditingDraft(null)
  }

  return (
    <div className="space-y-8">
      <EventDetailEditorCard
        draft={eventEditDraft}
        onChange={setEventEditDraft}
        onSave={() => saveEventDraft(eventEditDraft)}
      />

      <GlassPanel variant="card">
        <div className={surfacePatterns.panelBodyClassName}>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="font-display text-3xl font-semibold tracking-tight text-heading">
                Program Schedule
              </h2>
            </div>

            <button
              aria-label="Add session"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-primary/30 bg-transparent text-primary transition hover:bg-primary hover:text-card"
              onClick={handleAddSession}
              type="button"
            >
              <LuPlus aria-hidden="true" className="h-5 w-5" />
            </button>
          </div>

          {addingNew ? (
            <div className="mt-6">
              <SessionForm
                onChange={setNewSession}
                onCancel={() => {
                  setAddingNew(false)
                  setNewSession(emptySession())
                }}
                onSave={handleSaveNewSession}
                saveLabel="Add Session"
                session={newSession}
              />
            </div>
          ) : null}

          <div className="mt-6 space-y-3">
            {programError ? <p className="type-body text-error">{programError}</p> : null}
            {sessions.map((session) => {
              const isEditing = editingSessionId === session.id && editingDraft

              return (
                <div className="rounded-[24px] border border-divider bg-card p-4" key={session.id}>
                  {isEditing ? (
                    <SessionForm
                      onChange={setEditingDraft}
                      onCancel={() => {
                        setEditingSessionId(null)
                        setEditingDraft(null)
                      }}
                      onDelete={() => handleDeleteSession(session.id)}
                      deleteDisabled
                      deleteTooltip="Delete not yet supported."
                      onSave={() => handleSaveSession(session.id)}
                      saveLabel="Save"
                      session={editingDraft}
                    />
                  ) : (
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <p className="font-label text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                          {session.schedule.dateLabel} · {session.schedule.dayLabel}
                        </p>
                        <h3 className="mt-2 text-lg font-semibold text-heading">
                          {session.title || 'Untitled session'}
                        </h3>
                        <p className="mt-1 text-sm text-body">
                          {summarizeSession(session)} · {getSessionTypeLabel(session)}
                        </p>
                        {session.speakerName ? (
                          <p className="mt-1 text-sm text-muted">
                            {session.speakerName}{session.speakerRole ? ` · ${session.speakerRole}` : ''}
                          </p>
                        ) : null}
                      </div>

                      <div className="flex gap-2">
                        <button
                          aria-label="Edit session"
                          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-divider text-heading transition hover:border-primary/30 hover:text-primary"
                          onClick={() => {
                            setEditingSessionId((currentId) => (currentId === session.id ? null : session.id))
                            setEditingDraft(normalizeSession(session))
                            setAddingNew(false)
                          }}
                          type="button"
                        >
                          <LuPencil aria-hidden="true" className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </GlassPanel>
    </div>
  )
}
