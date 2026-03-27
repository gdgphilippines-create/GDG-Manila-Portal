import { Suspense } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { PageShell } from '@/components/layout'
import { useAuth } from '@/app/hooks/useAuth'
import { FacilitatorSection, DEFAULT_FACILITATOR_TAB } from '@/features/facilitator'

export default function FacilitatorLayout() {
  const { user } = useAuth()
  const location = useLocation()
  const authEmail = String(user?.email || '').trim().toLowerCase()
  const activeTab =
    location.pathname.split('/').filter(Boolean).at(-1) ?? DEFAULT_FACILITATOR_TAB

  return (
    <PageShell>
      <FacilitatorSection activeTab={activeTab}>
        <Suspense fallback={<p className="type-body text-muted">Loading section...</p>}>
          <Outlet context={{ authEmail }} />
        </Suspense>
      </FacilitatorSection>
    </PageShell>
  )
}
