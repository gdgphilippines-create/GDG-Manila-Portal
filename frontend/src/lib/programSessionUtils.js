function slugify(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export const builtInSessionTypes = [
  { value: 'keynote', label: 'Keynote' },
  { value: 'workshop', label: 'Workshop' },
  { value: 'panel', label: 'Panel' },
  { value: 'fireside', label: 'Fireside' },
  { value: 'break', label: 'Break' },
  { value: 'custom', label: 'Custom' },
]

function createId(prefix) {
  const randomPart = Math.random().toString(36).slice(2, 8)
  return `${prefix}-${Date.now()}-${randomPart}`
}

export function createAction(labelKey, overrides = {}) {
  const base =
    labelKey === 'startCodelab'
      ? { labelKey, variant: 'primary', icon: 'play' }
      : labelKey === 'slides'
        ? { labelKey, variant: 'secondary', icon: 'eye' }
        : { labelKey, variant: 'secondary' }

  return {
    id: overrides.id || createId(slugify(labelKey) || 'resource'),
    href: overrides.href || '',
    ...base,
    ...overrides,
  }
}

export function emptySession(type = 'session') {
  const structuralType = type === 'break' ? 'break' : 'session'

  return {
    id: createId(structuralType),
    type: structuralType,
    sessionType: structuralType === 'break' ? 'break' : 'workshop',
    customSessionType: '',
    schedule: {
      dateLabel: 'March 20',
      dayLabel: 'Friday',
      startTime: '09:00 AM',
      endTime: '10:00 AM',
    },
    title: structuralType === 'break' ? 'New Break' : 'New Session',
    description: '',
    speakerImageUrl: '',
    speakerName: '',
    speakerRole: '',
    illustration: 'robot',
    actions:
      structuralType === 'break'
        ? [createAction('questHere')]
        : [createAction('startCodelab'), createAction('slides')],
  }
}

export function normalizeSession(session) {
  const sessionType = session.sessionType || (session.type === 'break' ? 'break' : 'workshop')
  const normalizedType = sessionType === 'break' ? 'break' : 'session'

  return {
    description: '',
    speakerImageUrl: '',
    speakerRole: '',
    customSessionType: '',
    ...session,
    type: normalizedType,
    sessionType,
  }
}

export function addAction(session, labelKey, href = '') {
  return {
    ...session,
    actions: [...(session.actions ?? []), createAction(labelKey, { href })],
  }
}

export function updateActionById(session, actionId, href) {
  return {
    ...session,
    actions: (session.actions ?? []).map((action) => (
      action.id === actionId ? { ...action, href } : action
    )),
  }
}

export function removeActionById(session, actionId) {
  return {
    ...session,
    actions: (session.actions ?? []).filter((action) => action.id !== actionId),
  }
}

export function summarizeSession(session) {
  return `${session.schedule.startTime} - ${session.schedule.endTime}`
}

export function getSessionTypeLabel(session) {
  if (session.sessionType === 'custom') {
    return session.customSessionType || 'Custom'
  }

  const match = builtInSessionTypes.find((typeOption) => typeOption.value === session.sessionType)
  return match?.label || 'Session'
}

function parseTimeLabel(value) {
  const match = String(value || '').trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i)

  if (!match) {
    return Number.MAX_SAFE_INTEGER
  }

  let hours = Number(match[1]) % 12
  const minutes = Number(match[2])
  const meridiem = match[3].toUpperCase()

  if (meridiem === 'PM') {
    hours += 12
  }

  return (hours * 60) + minutes
}

function parseDateLabel(value) {
  const parsed = Date.parse(`${value} 2026`)
  return Number.isNaN(parsed) ? Number.MAX_SAFE_INTEGER : parsed
}

export function sortSessions(sessions) {
  return [...sessions].sort((left, right) => {
    const dateDiff = parseDateLabel(left.schedule?.dateLabel) - parseDateLabel(right.schedule?.dateLabel)
    if (dateDiff !== 0) {
      return dateDiff
    }

    const timeDiff = parseTimeLabel(left.schedule?.startTime) - parseTimeLabel(right.schedule?.startTime)
    if (timeDiff !== 0) {
      return timeDiff
    }

    return left.title.localeCompare(right.title)
  })
}
