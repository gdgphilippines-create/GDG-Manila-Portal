import GlassPanel from '../../../components/ui/GlassPanel'
import GoogleDots from '../../../components/ui/GoogleDots'
import SectionHeader from '../../../components/ui/SectionHeader'
import { adminActionsCopy, adminPageCopy } from '../../../copy/admin'
import { useMachine } from '../machine/useMachine'
import ActionGrid from './ActionGrid'

export default function AdminSection() {
  const { updateView, status, error } = useMachine()

  return (
    <GlassPanel className="mx-auto max-w-content" variant="card">
      <div className="pad-card md:px-10 md:py-10">
        <GoogleDots className="mb-8 justify-start" />
        <div className="mb-10">
          <SectionHeader
            description={adminPageCopy.description}
            eyebrow={adminPageCopy.eyebrow}
            title={adminPageCopy.title}
          />
        </div>
        {error ? <p className="type-body mb-4 text-error">{error}</p> : null}
        <ActionGrid
          actions={adminActionsCopy}
          isPending={status === 'loading'}
          onSelect={updateView}
        />
      </div>
    </GlassPanel>
  )
}
