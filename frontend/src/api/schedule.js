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
  const resolvedEmail = String(email || '').trim().toLowerCase() || getAuthEmail()
  const payload = {
    email: resolvedEmail,
    sessionData,
  }

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

  return apiRequest('/schedule/update', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}
