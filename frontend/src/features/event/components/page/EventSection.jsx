import { VIEW_STATES } from '@/core/constants'
import StatusCard from '../status/StatusCard'
import { useEventViewModel } from '../../hooks/useEventViewModel'
import ProgramView from '../../routes/ProgramView'

export default function EventSection() {
  const { currentView, error } = useEventViewModel()

  if (currentView !== VIEW_STATES.LIVE || error) {
    return (
      <section className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-6 md:py-10">
        <StatusCard activeView={currentView} error={error} />
      </section>
    )
  }

  return <ProgramView withPageShell={false} />
}
