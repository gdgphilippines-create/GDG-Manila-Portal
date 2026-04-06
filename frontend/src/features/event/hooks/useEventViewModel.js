import { useActiveView } from '@/services/view-sync/useActiveView'

export function useEventViewModel() {
  const { activeView, error, status } = useActiveView()

  return {
    currentView: activeView,
    error,
    status,
  }
}
