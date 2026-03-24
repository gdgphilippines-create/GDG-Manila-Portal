import { getSchedule, updateSession } from '@/services/api/schedule'
import { programCopy } from '@/constants/program'
import { createPollingSubscription } from '@/lib/createPollingSubscription'
import { emit, EVENT_BUS_EVENTS } from '@/lib/eventBus'
import { programSessions as initialSessions } from '@/lib/programSessionData'
import { emptySession, normalizeSession, sortSessions } from '@/lib/programSessionUtils'

const PROGRAM_POLL_INTERVAL_MS = 15000

let inMemoryEventDraft = null

const LOCAL_SESSION_PRESENTATION_KEY = 'gdg-manila-program-session-presentation'

function readLocalJson(key) {
  if (typeof window === 'undefined') {
    return null
  }

  const rawValue = window.localStorage.getItem(key)

  if (!rawValue) {
    return null
  }

  try {
    return JSON.parse(rawValue)
  } catch {
    return null
  }
}

function writeLocalJson(key, value) {
  if (typeof window === 'undefined') {
    return
  }

  if (!value) {
    window.localStorage.removeItem(key)
    return
  }

  window.localStorage.setItem(key, JSON.stringify(value))
}

function getEventDayLabels(dateValue) {
  const parsedDate = new Date(dateValue)

  if (Number.isNaN(parsedDate.getTime())) {
    return { dateLabel: 'Schedule', dayLabel: '' }
  }

  return {
    dateLabel: parsedDate.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
    }),
    dayLabel: parsedDate.toLocaleDateString('en-US', {
      weekday: 'long',
    }),
  }
}

function toUiTimeLabel(value) {
  const rawValue = String(value || '').trim()

  if (!rawValue) {
    return ''
  }

  if (/\b(am|pm)\b/i.test(rawValue)) {
    return rawValue
  }

  const hhmmMatch = rawValue.match(/^(\d{1,2}):(\d{2})$/)
  if (hhmmMatch) {
    const hours24 = Number(hhmmMatch[1])
    const minutes = hhmmMatch[2]
    const meridiem = hours24 >= 12 ? 'PM' : 'AM'
    const hours12 = hours24 % 12 || 12
    return `${String(hours12).padStart(2, '0')}:${minutes} ${meridiem}`
  }

  const parsedDate = new Date(rawValue)
  if (!Number.isNaN(parsedDate.getTime())) {
    return parsedDate.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })
  }

  return rawValue
}

function toBackendSessionData(session) {
  const normalizedSession = normalizeSession(session)

  return {
    id: normalizedSession.id,
    title: normalizedSession.title || '',
    speaker: normalizedSession.speakerName || '',
    startTime: normalizedSession.schedule?.startTime || '',
    endTime: normalizedSession.schedule?.endTime || '',
    location: normalizedSession.venue || '',
    description: normalizedSession.description || '',
  }
}

function buildSessionPresentationMap(sessions) {
  return new Map(
    (Array.isArray(sessions) ? sessions : []).map((session) => [session.id, normalizeSession(session)]),
  )
}

function applyScheduleToSession(baseSession, scheduleEntry, eventDraft) {
  const { dateLabel, dayLabel } = getEventDayLabels(eventDraft?.date)

  return normalizeSession({
    ...baseSession,
    id: scheduleEntry.id,
    title: scheduleEntry.title,
    description: scheduleEntry.description,
    speakerName: scheduleEntry.speaker,
    venue: scheduleEntry.location,
    schedule: {
      ...(baseSession?.schedule ?? {}),
      dateLabel,
      dayLabel,
      startTime: toUiTimeLabel(scheduleEntry.startTime),
      endTime: toUiTimeLabel(scheduleEntry.endTime),
    },
  })
}

const defaultProgramState = {
  eventDraft: {
    title: programCopy.title,
    heroImageUrl: programCopy.heroImageUrl,
    description: programCopy.fullDescription,
    location: programCopy.eventDetails?.venue || 'Makati, Manila',
    date: 'Oct 20, 2026',
  },
  sessions: sortSessions(initialSessions.map(normalizeSession)),
}

function normalizeProgramState(programState = {}) {
  return {
    eventDraft: {
      ...defaultProgramState.eventDraft,
      ...(programState.eventDraft && typeof programState.eventDraft === 'object'
        ? programState.eventDraft
        : {}),
    },
    sessions: sortSessions(
      Array.isArray(programState.sessions)
        ? programState.sessions.map(normalizeSession)
        : defaultProgramState.sessions,
    ),
  }
}

export function getDefaultProgramState() {
  const persistedSessions = readLocalJson(LOCAL_SESSION_PRESENTATION_KEY)

  const baseState = normalizeProgramState({
    ...defaultProgramState,
    sessions: Array.isArray(persistedSessions)
      ? persistedSessions
      : defaultProgramState.sessions,
  })

  return {
    ...baseState,
    eventDraft: inMemoryEventDraft
      ? {
          ...baseState.eventDraft,
          ...inMemoryEventDraft,
        }
      : baseState.eventDraft,
  }
}

function mergeProgramUpdate(programState) {
  const baseState = getDefaultProgramState()
  const nextEventDraft =
    programState?.eventDraft && typeof programState.eventDraft === 'object'
      ? {
          ...baseState.eventDraft,
          ...programState.eventDraft,
        }
      : baseState.eventDraft

  const nextSessions = Array.isArray(programState?.sessions)
    ? programState.sessions
    : baseState.sessions

  return normalizeProgramState({
    eventDraft: nextEventDraft,
    sessions: nextSessions,
  })
}

export function buildProgramEventMeta(eventDraft) {
  return {
    ...programCopy,
    title: eventDraft.title,
    heroImageUrl: eventDraft.heroImageUrl,
    heroImageAlt: `${eventDraft.title} Banner`,
    description: eventDraft.description,
    fullDescription: eventDraft.description,
    eventDetails: {
      ...programCopy.eventDetails,
      venue: eventDraft.location,
    },
  }
}

export const programService = {
  async get() {
    const baseState = getDefaultProgramState()
    const schedule = await getSchedule()

    if (!Array.isArray(schedule) || schedule.length === 0) {
      return baseState
    }

    const defaultPresentationById = buildSessionPresentationMap(defaultProgramState.sessions)
    const localPresentationById = buildSessionPresentationMap(
      readLocalJson(LOCAL_SESSION_PRESENTATION_KEY),
    )

    const mappedSessions = schedule
      .filter((entry) => entry && typeof entry === 'object' && entry.id)
      .map((entry) => {
        const baseSession =
          localPresentationById.get(entry.id)
          ?? defaultPresentationById.get(entry.id)
          ?? normalizeSession({
            ...emptySession('session'),
            id: entry.id,
          })

        return applyScheduleToSession(baseSession, entry, baseState.eventDraft)
      })

    return {
      eventDraft: baseState.eventDraft,
      sessions: sortSessions(mappedSessions),
    }
  },

  async save(programState, { email } = {}) {
    const normalizedProgram = mergeProgramUpdate(programState)

    if (programState?.eventDraft) {
      inMemoryEventDraft = normalizedProgram.eventDraft
    }

    if (programState?.sessions) {
      writeLocalJson(LOCAL_SESSION_PRESENTATION_KEY, normalizedProgram.sessions)
    }

    if (programState?.sessions) {
      const normalizedEmail = String(email || '').trim().toLowerCase()

      if (!normalizedEmail) {
        throw new Error('Login required to update the schedule.')
      }

      await Promise.all(
        normalizedProgram.sessions.map((session) => updateSession(normalizedEmail, toBackendSessionData(session))),
      )
    }

    emit(EVENT_BUS_EVENTS.PROGRAM_CHANGED, normalizedProgram)
    return normalizedProgram
  },

  subscribe(onChange) {
    return createPollingSubscription({
      event: EVENT_BUS_EVENTS.PROGRAM_CHANGED,
      normalize: normalizeProgramState,
      onChange,
      pollIntervalMs: PROGRAM_POLL_INTERVAL_MS,
      read: () => programService.get(),
    })
  },
}
