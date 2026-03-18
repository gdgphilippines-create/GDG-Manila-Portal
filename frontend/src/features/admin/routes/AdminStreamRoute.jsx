import { GlassPanel } from '@/components/ui'
import { adminActionsCopy, adminOverviewLabels } from '@/copy/admin'
import ActionGrid from '../components/controls/ActionGrid'
import { useOutletContext } from 'react-router-dom'

export default function AdminStreamRoute() {
  const { currentView, error, isPending, updateView } = useOutletContext()

  return (
    <GlassPanel variant="card">
      <div className="px-6 py-6 md:px-6 md:py-6">
        <h2 className="text-left font-sans text-[20px] font-semibold leading-7 text-heading">
          {adminOverviewLabels.controlsTitle}
        </h2>
        <div className="mt-6">
          <ActionGrid
            actions={adminActionsCopy}
            activeView={currentView}
            isPending={isPending}
            onSelect={updateView}
          />
        </div>
        {error ? <p className="type-body mt-6 text-error">{error}</p> : null}
      </div>
    </GlassPanel>
  )
}
