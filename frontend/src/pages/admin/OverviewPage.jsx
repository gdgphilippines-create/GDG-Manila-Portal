import { useOutletContext } from 'react-router-dom'
import ProgramPage from '@/pages/ProgramPage'

export default function OverviewPage() {
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
