import { useEffect, useState } from 'react'
import { LuCircleOff, LuClock3, LuPencil, LuPlus, LuRadio } from 'react-icons/lu'
import { adminActionsCopy } from '@/constants/admin'
import { VIEW_STATES } from '@/constants'
import { EventDetailEditorCard, SessionForm } from '@/features/admin'
import { useOutletContext } from 'react-router-dom'
import { streamStatusClassNames } from '@/styles/theme'
import {
  emptySession,
  getSessionTypeLabel,
  getSessionTypeTone,
  normalizeSession,
  sortSessions,
} from '@/lib/programSessionUtils'

const streamStatusIcons = {
  [VIEW_STATES.WAITING]: LuClock3,
  [VIEW_STATES.LIVE]: LuRadio,
  [VIEW_STATES.ENDED]: LuCircleOff,
}

const viewToToneKey = {
  [VIEW_STATES.WAITING]: 'waiting',
  [VIEW_STATES.LIVE]: 'live',
  [VIEW_STATES.ENDED]: 'ended',
}

function groupSessionsByDate(sessions) {
  return Object.values(
    sortSessions(sessions).reduce((groups, session) => {
      const groupId = `${session.schedule.dateLabel}-${session.schedule.dayLabel}`

      if (!groups[groupId]) {
        groups[groupId] = {
          dayLabel: session.schedule.dayLabel,
          dateLabel: session.schedule.dateLabel,
          id: groupId.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          sessions: [],
        }
      }

      groups[groupId].sessions.push(session)
      return groups
    }, {}),
  )
}

export default function ProgramManagePage() {
  const {
    currentView,
    eventDraft,
    error,
    isPending,
    programError,
    saveEventDraft,
    saveSessions,
    sessions,
    updateView,
  } = useOutletContext()
  const [addingNew, setAddingNew] = useState(false)
  const [editingSessionId, setEditingSessionId] = useState(null)
  const [newSession, setNewSession] = useState(emptySession())
  const [editingDraft, setEditingDraft] = useState(null)
  const [eventEditDraft, setEventEditDraft] = useState(eventDraft)

  useEffect(() => {
    setEventEditDraft(eventDraft)
  }, [eventDraft])

  const groupedSessions = groupSessionsByDate(sessions)

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

  function beginEditingSession(session) {
    setEditingSessionId((currentId) => (currentId === session.id ? null : session.id))
    setEditingDraft(normalizeSession(session))
    setAddingNew(false)
  }

  return (
    <div className="grid items-start gap-8 lg:grid-cols-[minmax(20rem,1fr)_minmax(0,1fr)]">
      <section className="space-y-4">
        <EventDetailEditorCard
          draft={eventEditDraft}
          onChange={setEventEditDraft}
          onSave={() => saveEventDraft(eventEditDraft)}
        />
      </section>

      <section className="space-y-4 lg:border-l lg:border-divider/70 lg:pl-8">
        <div className="flex flex-wrap items-center justify-end gap-3">
          <div className="inline-flex flex-wrap items-center gap-1.5 rounded-full border border-divider bg-card/60 p-1">
            {adminActionsCopy.map((action) => {
              const Icon = streamStatusIcons[action.view] ?? LuClock3
              const toneKey = viewToToneKey[action.view] ?? 'waiting'
              const tone = streamStatusClassNames[toneKey]
              const isActive = action.view === currentView

              return (
                <button
                  aria-pressed={isActive}
                  className={`inline-flex h-10 items-center gap-2 rounded-full border px-4 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60 ${
                    isActive ? tone.active : tone.inactive
                  }`.trim()}
                  disabled={isPending}
                  key={action.view}
                  onClick={() => updateView(action.view)}
                  type="button"
                >
                  <Icon aria-hidden="true" className="h-4 w-4" />
                  <span>{action.label}</span>
                  {isActive && action.view === VIEW_STATES.LIVE ? (
                    <span className="inline-flex h-2 w-2 rounded-full bg-success animate-[pulse_1.5s_ease-in-out_infinite]" />
                  ) : null}
                </button>
              )
            })}
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

        <div className="space-y-4 lg:max-h-[calc(100vh-11rem)] lg:overflow-y-auto lg:pr-2">
          {error ? <p className="type-body text-error">{error}</p> : null}

          {addingNew ? (
            <div className="rounded-dialog border border-divider/80 bg-card/70">
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

          {programError ? <p className="type-body text-error">{programError}</p> : null}

          <div className="space-y-6">
            {groupedSessions.map((group) => (
              <section className="space-y-2" key={group.id}>
                <div className="sticky top-0 z-10 bg-[rgb(var(--color-bg-page))]/95 py-2 backdrop-blur-sm">
                  <p className="font-label text-xs font-semibold uppercase tracking-label-mid text-body">
                    {`${group.dateLabel} · ${group.dayLabel}`.toUpperCase()}
                  </p>
                </div>

                <div className="space-y-2">
                  {group.sessions.map((session) => {
                    const isEditing = editingSessionId === session.id && editingDraft
                    const sessionTypeTone = getSessionTypeTone(session)
                    const metadata = [
                      session.speakerName
                        ? `${session.speakerName}${session.speakerRole ? ` · ${session.speakerRole}` : ''}`
                        : '',
                      session.venue || '',
                    ].filter(Boolean).join(' · ')

                    return (
                      <div className="rounded-panel border border-divider/80 bg-card/70" key={session.id}>
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
                          <button
                            className="group flex w-full items-start gap-3 px-4 py-3 text-left transition hover:bg-card"
                            onClick={() => beginEditingSession(session)}
                            type="button"
                          >
                            <div className="min-w-[112px] shrink-0 pt-0.5">
                              <p className="text-type-field leading-5 text-body">
                                {session.schedule.startTime}
                              </p>
                              <p className="text-type-field leading-5 text-body">
                                {session.schedule.endTime}
                              </p>
                            </div>

                            <div className="min-w-0 flex-1">
                              <h3 className="text-sm font-semibold text-heading">
                                {session.title || 'Untitled session'}
                              </h3>
                              <span
                                className={`mt-1 inline-flex rounded-full border px-2 py-0.5 text-type-badge uppercase tracking-label-narrow ${sessionTypeTone.badge}`.trim()}
                              >
                                {getSessionTypeLabel(session)}
                              </span>
                              {metadata ? (
                                <p className="mt-1 text-sm text-muted">{metadata}</p>
                              ) : null}
                            </div>

                            <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted transition group-hover:text-primary">
                              <LuPencil aria-hidden="true" className="h-4 w-4" />
                            </span>
                          </button>
                        )}
                      </div>
                    )
                  })}
                </div>
              </section>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
