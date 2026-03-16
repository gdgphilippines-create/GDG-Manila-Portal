import { Suspense } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import AdminSection from '@/features/admin/components/AdminSection'
import {
  adminOverviewLabels,
  getAdminStatusPill,
} from '@/features/admin/copy'
import { adminOverviewDetails } from '@/features/admin/data'
import { useAdminViewModel } from '@/features/admin/hooks/useAdminViewModel'

export default function AdminScreen() {
  const { currentView, updateView, isPending, error } = useAdminViewModel()
  const currentStatus = getAdminStatusPill(currentView, isPending)
  const location = useLocation()
  const activeTab = location.pathname.split('/').filter(Boolean).at(-1) ?? 'overview'

  return (
    <AdminSection
      activeTab={activeTab}
      currentStatus={currentStatus}
      event={adminOverviewDetails}
      labels={adminOverviewLabels}
    >
      <Suspense fallback={<p className="type-body text-muted">Loading section...</p>}>
        <Outlet context={{ currentStatus, currentView, error, isPending, updateView }} />
      </Suspense>
    </AdminSection>
  )
}
