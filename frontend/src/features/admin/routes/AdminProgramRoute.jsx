import GlassPanel from '@/components/ui/GlassPanel'
import SectionHeader from '@/components/ui/SectionHeader'
import { adminActionsCopy, adminOverviewLabels } from '@/copy/admin'
import ActionGrid from '../components/controls/ActionGrid'
import { surfacePatterns } from '@/styles/layout'
import { useOutletContext } from 'react-router-dom'

export default function AdminProgramRoute() {
  const { error, isPending, updateView } = useOutletContext()

  return (
    <GlassPanel variant="card">
      <div className={surfacePatterns.panelBodyClassName}>
        <SectionHeader
          description={adminOverviewLabels.controlsDescription}
          eyebrow={adminOverviewLabels.controlsEyebrow}
          title={adminOverviewLabels.controlsTitle}
        />
        {error ? <p className="type-body mt-6 text-error">{error}</p> : null}
        <div className="mt-8">
          <ActionGrid actions={adminActionsCopy} isPending={isPending} onSelect={updateView} />
        </div>
      </div>
    </GlassPanel>
  )
}
