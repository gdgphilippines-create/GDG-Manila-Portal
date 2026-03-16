import GlassPanel from '@/components/ui/GlassPanel'
import SectionHeader from '@/components/ui/SectionHeader'
import { adminOverviewLabels } from '@/copy/admin'
import { surfacePatterns } from '@/styles/layout'
import { useOutletContext } from 'react-router-dom'

export default function AdminAlertsRoute() {
  const { error } = useOutletContext()

  return (
    <GlassPanel variant="card">
      <div className={surfacePatterns.panelBodyClassName}>
        <SectionHeader
          eyebrow={adminOverviewLabels.alertsEyebrow}
          title={adminOverviewLabels.alertsTitle}
        />
        {error ? <p className="type-body mt-6 text-error">{error}</p> : null}
      </div>
    </GlassPanel>
  )
}
