export const programSessions = [
  {
    id: 'building-agents-gemini-langchain-morning',
    type: 'session',
    schedule: {
      dateLabel: 'March 20',
      dayLabel: 'Friday',
      startTime: '09:30 AM',
      endTime: '11:00 AM',
    },
    title: 'Building Agents with Gemini & LangChain',
    speakerName: 'Alejandra Garcia',
    venue: 'Workshop Hall A',
    illustration: 'robot',
    actions: [
      { id: 'start-codelab', labelKey: 'startCodelab', variant: 'primary', icon: 'play' },
      { id: 'slides', labelKey: 'slides', variant: 'secondary', icon: 'eye' },
    ],
  },
  {
    id: 'coffee-break',
    type: 'break',
    schedule: {
      dateLabel: 'March 20',
      dayLabel: 'Friday',
      startTime: '12:00 PM',
      endTime: '01:00 PM',
    },
    title: 'Coffee Break',
    actions: [
      { id: 'quest-here', labelKey: 'questHere', variant: 'highlight' },
    ],
  },
  {
    id: 'building-agents-gemini-langchain-repeat',
    type: 'session',
    schedule: {
      dateLabel: 'March 20',
      dayLabel: 'Friday',
      startTime: '09:30 AM',
      endTime: '11:00 AM',
    },
    title: 'Building Agents with Gemini & LangChain',
    speakerName: 'Alejandra Garcia',
    venue: 'Workshop Hall A',
    illustration: 'robot',
    actions: [
      { id: 'start-codelab', labelKey: 'startCodelab', variant: 'primary', icon: 'play' },
      { id: 'slides', labelKey: 'slides', variant: 'secondary', icon: 'eye' },
    ],
  },
]

export const programSessionGroups = Object.values(
  programSessions.reduce((groups, session) => {
    const groupId = `${session.schedule.dateLabel}-${session.schedule.dayLabel}`

    if (!groups[groupId]) {
      groups[groupId] = {
        id: groupId.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        dateLabel: session.schedule.dateLabel,
        dayLabel: session.schedule.dayLabel,
        sessions: [],
      }
    }

    groups[groupId].sessions.push(session)

    return groups
  }, {}),
)
