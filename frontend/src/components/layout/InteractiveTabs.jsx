import { typographyPatterns } from '@/styles/layout'
import { getInteractiveTabClassName, getInteractiveTabTextClassName } from '@/styles/theme'

export default function InteractiveTabs({ activeTab, ariaLabel, onChange, tabs }) {
  return (
    <nav aria-label={ariaLabel} className="border-b border-divider">
      <ul className="flex flex-wrap gap-6">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id

          return (
            <li key={tab.id}>
              <button
                aria-current={isActive ? 'page' : undefined}
                className={getInteractiveTabClassName(isActive)}
                onClick={() => onChange(tab.id)}
                type="button"
              >
                <span
                  className={`${typographyPatterns.tabLabelClassName} ${getInteractiveTabTextClassName(isActive)}`}
                >
                  {tab.label}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
