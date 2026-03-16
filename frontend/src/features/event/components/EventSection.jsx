import StatusCard from './StatusCard'
import { useEventViewModel } from '../hooks/useEventViewModel'

export default function EventSection() {
  const { currentView, error } = useEventViewModel()

  return <StatusCard activeView={currentView} error={error} />
}
