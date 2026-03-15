import GlassPanel from '../../../components/ui/GlassPanel'
import GoogleDots from '../../../components/ui/GoogleDots'
import SectionHeader from '../../../components/ui/SectionHeader'
import { adminActionsCopy, adminPageCopy } from '../../../copy/admin'
import { useMachine } from '../machine/useMachine'
import ActionGrid from './ActionGrid'

export default function AdminSection() {
  const { updateView, status, error } = useMachine()

  return (
    <GlassPanel className="mx-auto max-w-4xl">
      <div className="p-8 md:p-10">
        <GoogleDots className="mb-8 justify-start" />
        <div className="mb-10">
          <SectionHeader
            description={adminPageCopy.description}
            eyebrow={adminPageCopy.eyebrow}
            title={adminPageCopy.title}
          />
        </div>
        {error ? <p className="mb-4 text-sm text-[#c5221f]">{error}</p> : null}
        <ActionGrid
          actions={adminActionsCopy}
          isPending={status === 'loading'}
          onSelect={updateView}
        />
      </div>
    </GlassPanel>
  )
}
