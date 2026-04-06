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
  { value: 'break', label: 'Break' },
  { value: 'custom', label: 'Custom' },
]

export const sessionTypeToneClassNames = {
  keynote: {
    accentBorder: 'border-l-violet-400',
    badge: 'border-violet-300 bg-violet-100 text-violet-800',
    dot: 'bg-violet-500',
    selected: 'border-violet-300 bg-violet-100 text-violet-800',
    surface: 'border-violet-200 bg-violet-50 text-violet-800 hover:border-violet-300',
    trigger: 'border-violet-200 bg-violet-50 text-violet-800',
  },
  workshop: {
    accentBorder: 'border-l-blue-400',
    badge: 'border-blue-300 bg-blue-100 text-blue-800',
    dot: 'bg-blue-500',
    selected: 'border-blue-300 bg-blue-100 text-blue-800',
    surface: 'border-blue-200 bg-blue-50 text-blue-800 hover:border-blue-300',
    trigger: 'border-blue-200 bg-blue-50 text-blue-800',
  },
  panel: {
    accentBorder: 'border-l-rose-400',
    badge: 'border-rose-300 bg-rose-100 text-rose-800',
    dot: 'bg-rose-500',
    selected: 'border-rose-300 bg-rose-100 text-rose-800',
    surface: 'border-rose-200 bg-rose-50 text-rose-800 hover:border-rose-300',
    trigger: 'border-rose-200 bg-rose-50 text-rose-800',
  },
  break: {
    accentBorder: 'border-l-amber-400',
    badge: 'border-amber-300 bg-amber-100 text-amber-900',
    dot: 'bg-amber-500',
    selected: 'border-amber-300 bg-amber-100 text-amber-900',
    surface: 'border-amber-200 bg-amber-50 text-amber-900 hover:border-amber-300',
    trigger: 'border-amber-200 bg-amber-50 text-amber-900',
  },
  meal: {
    accentBorder: 'border-l-emerald-400',
    badge: 'border-emerald-300 bg-emerald-100 text-emerald-800',
    dot: 'bg-emerald-500',
    selected: 'border-emerald-300 bg-emerald-100 text-emerald-800',
    surface: 'border-emerald-200 bg-emerald-50 text-emerald-800 hover:border-emerald-300',
    trigger: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  },
  networking: {
    accentBorder: 'border-l-fuchsia-400',
    badge: 'border-fuchsia-300 bg-fuchsia-100 text-fuchsia-800',
    dot: 'bg-fuchsia-500',
    selected: 'border-fuchsia-300 bg-fuchsia-100 text-fuchsia-800',
    surface: 'border-fuchsia-200 bg-fuchsia-50 text-fuchsia-800 hover:border-fuchsia-300',
    trigger: 'border-fuchsia-200 bg-fuchsia-50 text-fuchsia-800',
  },
  registration: {
    accentBorder: 'border-l-sky-400',
    badge: 'border-sky-300 bg-sky-100 text-sky-800',
    dot: 'bg-sky-500',
    selected: 'border-sky-300 bg-sky-100 text-sky-800',
    surface: 'border-sky-200 bg-sky-50 text-sky-800 hover:border-sky-300',
    trigger: 'border-sky-200 bg-sky-50 text-sky-800',
  },
  custom: {
    accentBorder: 'border-l-slate-400',
    badge: 'border-slate-300 bg-slate-100 text-slate-800',
    dot: 'bg-slate-500',
    selected: 'border-slate-300 bg-slate-100 text-slate-800',
    surface: 'border-slate-200 bg-slate-50 text-slate-800 hover:border-slate-300',
    trigger: 'border-slate-200 bg-slate-50 text-slate-800',
  },
}

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

function getCustomToneKey(customSessionType) {
  const normalizedValue = slugify(customSessionType)

  if (!normalizedValue) {
    return 'custom'
  }

  if (
    normalizedValue.includes('lunch')
    || normalizedValue.includes('breakfast')
    || normalizedValue.includes('dinner')
    || normalizedValue.includes('meal')
    || normalizedValue.includes('snack')
    || normalizedValue.includes('coffee')
  ) {
    return 'meal'
  }

  if (normalizedValue.includes('network')) {
    return 'networking'
  }

  if (normalizedValue.includes('register') || normalizedValue.includes('check-in')) {
    return 'registration'
  }

  return 'custom'
}

export function getSessionTypeTone(sessionOrType, customSessionType = '') {
  if (sessionOrType && typeof sessionOrType === 'object') {
    const session = sessionOrType
    const toneKey = session.sessionType === 'custom'
      ? getCustomToneKey(session.customSessionType)
      : session.sessionType

    return sessionTypeToneClassNames[toneKey] ?? sessionTypeToneClassNames.custom
  }

  const toneKey = sessionOrType === 'custom'
    ? getCustomToneKey(customSessionType)
    : sessionOrType

  return sessionTypeToneClassNames[toneKey] ?? sessionTypeToneClassNames.custom
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
