import { useActiveView } from '../../../hooks/useActiveView'

export function useMachine() {
  const { activeView, error, status } = useActiveView()

  return {
    currentView: activeView,
    error,
    status,
  }
}
