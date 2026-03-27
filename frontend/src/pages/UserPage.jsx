import { PageShell } from '@/components/layout'
import { VIEW_STATES } from '@/constants'
import { StatusCard, useEventViewModel } from '@/features/event'
import ProgramPage from './ProgramPage'

export default function UserPage() {
  const { currentView, error } = useEventViewModel()

  if (currentView !== VIEW_STATES.LIVE || error) {
    return (
      <PageShell>
        <section className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-6 md:py-10">
          <StatusCard activeView={currentView} error={error} />
        </section>
      </PageShell>
    )
  }

  return (
    <PageShell>
      <ProgramPage withPageShell={false} />
    </PageShell>
  )
}
