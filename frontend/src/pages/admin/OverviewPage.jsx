import { useOutletContext } from 'react-router-dom'
import ProgramPage from '@/pages/ProgramPage'
import { buildProgramEventMeta } from '@/services/program'

export default function OverviewPage() {
  const { eventDraft, sessions } = useOutletContext()

  return (
    <ProgramPage
      eventMetaOverride={buildProgramEventMeta(eventDraft)}
      sessionsOverride={sessions}
      withPageShell={false}
    />
  )
}
