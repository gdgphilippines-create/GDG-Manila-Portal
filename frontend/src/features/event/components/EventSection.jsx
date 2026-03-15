import StatusCard from '@/features/event/components/StatusCard'
import { useEventViewModel } from '@/features/event/hooks/useEventViewModel'

export default function EventSection() {
  const { currentView, error } = useEventViewModel()

  return <StatusCard activeView={currentView} error={error} />
}
