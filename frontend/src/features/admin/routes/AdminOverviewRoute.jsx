import StatusPill from '@/components/ui/StatusPill'
import { adminOverviewLabels } from '@/features/admin/copy'
import AdminOverviewCard from '@/features/admin/components/overview/AdminOverviewCard'
import { adminOverviewDetails } from '@/features/admin/data'
import { useOutletContext } from 'react-router-dom'

export default function AdminOverviewRoute() {
  const { currentStatus } = useOutletContext()

  return (
    <AdminOverviewCard
      event={adminOverviewDetails}
      labels={adminOverviewLabels}
      statusBadge={<StatusPill label={currentStatus.label} tone={currentStatus.tone} />}
    />
  )
}
