import { InteractiveTabs, ViewFrame } from '@/components/layout'
import { FACILITATOR_TABS, FACILITATOR_TAB_ROUTES, facilitatorLabels } from '../constants'

export default function FacilitatorSection({ activeTab, children }) {
  const tabs = [
    {
      id: FACILITATOR_TABS.OVERVIEW,
      label: facilitatorLabels.overviewTabLabel,
      to: FACILITATOR_TAB_ROUTES[FACILITATOR_TABS.OVERVIEW],
    },
    {
      id: FACILITATOR_TABS.VERIFICATION,
      label: facilitatorLabels.verificationTabLabel,
      to: FACILITATOR_TAB_ROUTES[FACILITATOR_TABS.VERIFICATION],
    },
  ]

  return (
    <ViewFrame>
      <div className="mb-8">
        <h1 className="text-type-subheading tracking-tight text-heading">
          Facilitator Panel
        </h1>
        <p className="mt-1 text-sm text-muted">
          Manage verifications and monitor event activity.
        </p>
      </div>

      <div className="w-full space-y-8">
        <InteractiveTabs
          activeTab={activeTab}
          ariaLabel={facilitatorLabels.tabsAriaLabel}
          tabs={tabs}
        />
        {children}
      </div>
    </ViewFrame>
  )
}
