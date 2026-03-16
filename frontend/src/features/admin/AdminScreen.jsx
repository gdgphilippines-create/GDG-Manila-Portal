import { Suspense } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import AdminSection from './components/AdminSection'
import { DEFAULT_ADMIN_TAB } from './constants'
import {
  adminOverviewLabels,
  getAdminStatusPill,
} from '@/copy/admin'
import { adminOverviewDetails } from './data'
import { useAdminViewModel } from './hooks/useAdminViewModel'

export default function AdminScreen() {
  const { currentView, updateView, isPending, error } = useAdminViewModel()
  const currentStatus = getAdminStatusPill(currentView, isPending)
  const location = useLocation()
  const activeTab = location.pathname.split('/').filter(Boolean).at(-1) ?? DEFAULT_ADMIN_TAB

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
