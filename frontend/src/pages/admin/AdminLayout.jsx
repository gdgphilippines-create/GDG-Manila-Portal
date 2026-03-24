import { PageShell } from '@/components/layout'
import { AdminScreen } from '@/features/admin'
import { useAuth } from '@/app/hooks/useAuth'

export default function AdminLayout() {
  const { user } = useAuth()
  const authEmail = String(user?.email || '').trim().toLowerCase()

  return (
    <PageShell>
      <AdminScreen authEmail={authEmail} />
    </PageShell>
  )
}
