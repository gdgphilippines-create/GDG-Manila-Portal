import { InteractiveTabs, ViewFrame } from '@/components/layout'
import { LuCircleOff, LuClock3, LuRadio } from 'react-icons/lu'

import { ADMIN_TABS, ADMIN_TAB_ROUTES } from '../constants'

const headerStatusClassNames = {
  warning: {
    className: 'border-slate-300 bg-slate-100 text-slate-700',
    icon: LuClock3,
  },
  success: {
    className: 'border-emerald-300 bg-emerald-100 text-emerald-800',
    icon: LuRadio,
  },
  danger: {
    className: 'border-rose-300 bg-rose-100 text-rose-700',
    icon: LuCircleOff,
  },
  neutral: {
    className: 'border-slate-300 bg-slate-100 text-slate-700',
    icon: LuClock3,
  },
}

export default function AdminSection({
  activeTab,
  children,
  currentStatus,
  event,
  labels,
}) {
  const tabs = [
    { id: ADMIN_TABS.OVERVIEW, label: labels.overviewTabLabel, to: ADMIN_TAB_ROUTES[ADMIN_TABS.OVERVIEW] },
    { id: ADMIN_TABS.PROGRAM, label: labels.programTabLabel, to: ADMIN_TAB_ROUTES[ADMIN_TABS.PROGRAM] },
    { id: ADMIN_TABS.ALERTS, label: labels.alertsTabLabel, to: ADMIN_TAB_ROUTES[ADMIN_TABS.ALERTS] },
  ]
  const headerStatusTone = headerStatusClassNames[currentStatus.tone] ?? headerStatusClassNames.neutral
  const HeaderStatusIcon = headerStatusTone.icon

  return (
    <ViewFrame>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-6">
        <div className="flex flex-wrap items-center gap-4">
          <h1 className="text-[22px] font-semibold leading-7 tracking-tight text-heading">
            {event.eventName}
          </h1>
          <span
            className={`inline-flex h-10 items-center gap-2 rounded-full border px-4 text-sm font-medium ${headerStatusTone.className}`.trim()}
          >
            <HeaderStatusIcon aria-hidden="true" className="h-4 w-4" />
            <span>{currentStatus.label}</span>
            {currentStatus.tone === 'success' ? (
              <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500 animate-[pulse_1.5s_ease-in-out_infinite]" />
            ) : null}
          </span>
        </div>
      </div>

      <div className="w-full space-y-8">
        <InteractiveTabs activeTab={activeTab} ariaLabel={labels.tabsAriaLabel} tabs={tabs} />
        {children}
      </div>
    </ViewFrame>
  )
}
