import { config } from '@/lib/config'
import { apiRequest } from './client'
import { getAuthEmail } from './auth'

const MOCK_SCHEDULE_STORAGE_KEY = 'gdg-manila-mock-schedule'

function readMockSchedule() {
  if (typeof window === 'undefined') {
    return []
  }

  const rawValue = window.localStorage.getItem(MOCK_SCHEDULE_STORAGE_KEY)

  if (!rawValue) {
    return [
      {
        id: 'mock-session-1',
        title: 'Welcome & Opening Remarks',
        speaker: 'GDG Manila',
        startTime: '09:00 AM',
        endTime: '09:15 AM',
        location: 'Main Hall',
        description: 'Kick off the day and review the agenda.',
      },
      {
        id: 'mock-session-2',
        title: 'Keynote',
        speaker: 'Guest Speaker',
        startTime: '09:15 AM',
        endTime: '10:00 AM',
        location: 'Main Hall',
        description: 'A short keynote to set the tone for the event.',
      },
    ]
  }

  try {
    const parsed = JSON.parse(rawValue)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeMockSchedule(schedule) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(MOCK_SCHEDULE_STORAGE_KEY, JSON.stringify(schedule))
}

/**
 * @typedef {Object} ScheduleSession
 * @property {string} id
 * @property {string} title
 * @property {string} speaker
 * @property {string} startTime
 * @property {string} endTime
 * @property {string} location
 * @property {string} description
 */

/**
 * Mirrors `GET /api/schedule` from the backend contract.
 *
 * @returns {Promise<ScheduleSession[]>}
 */
export async function getSchedule() {
  if (config.enableMockAuth) {
    return readMockSchedule()
  }

  return apiRequest('/schedule')
}

/**
 * Mirrors `POST /api/schedule/update` from the backend contract.
 *
 * @param {string} email
 * @param {ScheduleSession} sessionData
 */
export async function updateSession(email, sessionData) {
  if (config.enableMockAuth) {
    const current = readMockSchedule()
    const next = Array.isArray(current) ? [...current] : []
    const index = next.findIndex((session) => session.id === sessionData?.id)

    if (index === -1) {
      next.push(sessionData)
    } else {
      next[index] = {
        ...next[index],
        ...sessionData,
      }
    }

    writeMockSchedule(next)
    return sessionData
  }

  // 1. Fetch the entire current program from your backend
  const currentProgram = await apiRequest('/program')
  
  // 2. Find the session the Admin just edited and replace it in the array
  const updatedSessions = currentProgram.sessions.map((s) => 
    s.id === sessionData.id ? sessionData : s
  )

  // 3. Rebuild the massive payload exactly how the backend requires it
  const payload = {
    eventDraft: currentProgram.eventDraft || {},
    sessions: updatedSessions
  }

  // 4. Send the PUT request to our custom backend endpoint!
  return apiRequest('/program', {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}
