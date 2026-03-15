import { useMachine } from '../machine/useMachine'
import StatusCard from './StatusCard'

export default function EventSection() {
  const { currentView, error } = useMachine()

  return <StatusCard activeView={currentView} error={error} />
}
