import { ProgramView } from '@/features/event'

export default function ProgramPage({ isAdmin = false, withPageShell = true }) {
  return <ProgramView isAdmin={isAdmin} withPageShell={withPageShell} />
}
