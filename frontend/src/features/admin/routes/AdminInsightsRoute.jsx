import GlassPanel from '@/components/ui/GlassPanel'
import SectionHeader from '@/components/ui/SectionHeader'
import { adminOverviewLabels } from '@/copy/admin'
import { surfacePatterns } from '@/styles/layout'

export default function AdminInsightsRoute() {
  return (
    <GlassPanel variant="card">
      <div className={surfacePatterns.panelBodyClassName}>
        <SectionHeader
          description={adminOverviewLabels.insightsDescription}
          eyebrow={adminOverviewLabels.insightsEyebrow}
          title={adminOverviewLabels.insightsTitle}
        />
      </div>
    </GlassPanel>
  )
}
