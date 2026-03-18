import { ProgramView } from '@/features/event'

export default function ProgramPage({ eventMetaOverride, sessionsOverride, withPageShell = true }) {
  return (
    <ProgramView
      eventMetaOverride={eventMetaOverride}
      sessionsOverride={sessionsOverride}
      withPageShell={withPageShell}
    />
  )
}
