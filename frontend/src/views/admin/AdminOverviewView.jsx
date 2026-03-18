import { useOutletContext } from 'react-router-dom'
import ProgramPage from '@/views/program/ProgramPage'

export default function AdminOverviewView() {
  const { eventDraft, sessions } = useOutletContext()

  return (
    <ProgramPage
      eventMetaOverride={{
        title: eventDraft.title,
        heroImageUrl: eventDraft.heroImageUrl,
        heroImageAlt: `${eventDraft.title} Banner`,
        description: eventDraft.description,
        fullDescription: eventDraft.description,
        eventDetails: {
          venue: eventDraft.location,
        },
      }}
      sessionsOverride={sessions}
      withPageShell={false}
    />
  )
}
