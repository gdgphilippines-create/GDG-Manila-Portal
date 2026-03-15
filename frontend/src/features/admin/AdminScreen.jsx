import AdminSection from '@/features/admin/components/AdminSection'
import {
  adminActionsCopy,
  adminOverviewLabels,
  getAdminStatusPill,
} from '@/features/admin/copy'
import { adminOverviewDetails } from '@/features/admin/data'
import { useAdminViewModel } from '@/features/admin/hooks/useAdminViewModel'

export default function AdminScreen() {
  const { currentView, updateView, isPending, error } = useAdminViewModel()
  const currentStatus = getAdminStatusPill(currentView, isPending)

  return (
    <AdminSection
      actions={adminActionsCopy}
      currentStatus={currentStatus}
      error={error}
      event={adminOverviewDetails}
      isPending={isPending}
      labels={adminOverviewLabels}
      onSelect={updateView}
    />
  )
}
