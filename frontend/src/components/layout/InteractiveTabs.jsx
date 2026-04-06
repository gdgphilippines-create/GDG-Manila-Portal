import { NavLink } from 'react-router-dom'
import { typographyPatterns } from '@/styles/layout'
import { getInteractiveTabClassName, getInteractiveTabTextClassName } from '@/styles/theme'

export default function InteractiveTabs({ activeTab, ariaLabel, onChange, tabs }) {
  return (
    <nav aria-label={ariaLabel} className="relative">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 border-b border-divider"
      />
      <ul className="relative z-10 flex flex-wrap items-end gap-6">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id

          return (
            <li key={tab.id}>
              {tab.to ? (
                <NavLink
                  aria-current={isActive ? 'page' : undefined}
                  className={getInteractiveTabClassName(isActive)}
                  to={tab.to}
                >
                  <span
                    className={`${typographyPatterns.tabLabelClassName} ${getInteractiveTabTextClassName(isActive)}`}
                  >
                    {tab.label}
                  </span>
                  <span
                    aria-hidden="true"
                    className={`absolute bottom-0 left-1/2 h-0.5 w-20 -translate-x-1/2 rounded-full bg-primary transition-opacity duration-200 ${
                      isActive ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                </NavLink>
              ) : (
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
                  <span
                    aria-hidden="true"
                    className={`absolute bottom-0 left-1/2 h-0.5 w-20 -translate-x-1/2 rounded-full bg-primary transition-opacity duration-200 ${
                      isActive ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                </button>
              )}
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
