import StatusPill from '@/components/ui/StatusPill'
import { adminOverviewLabels } from '@/copy/admin'
import AdminOverviewCard from '../components/overview/AdminOverviewCard'
import { adminOverviewDetails } from '../data'
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
