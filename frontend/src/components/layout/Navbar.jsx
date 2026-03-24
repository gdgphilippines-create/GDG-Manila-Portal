import { Popover } from '@/components/ui'
import { useAuth } from '@/app/hooks/useAuth'
import { navbarCopy } from '@/constants/common'
import gdgLogo from '@/assets/BWAI-26-main-Logo-lockups-horizontal.png'
import { LuMenu } from 'react-icons/lu'

function ProfileAvatar({ name }) {
  const initials = name
    ? name
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() ?? '')
        .join('')
    : '?'

  return (
    <span className="flex h-10 w-10 items-center justify-center rounded-avatar border border-divider bg-slate-100 text-sm font-semibold text-heading shadow-[0_1px_3px_rgba(15,23,42,0.12),0_1px_2px_rgba(15,23,42,0.08)] transition-colors duration-200">
      {initials || '?'}
    </span>
  )
}

export default function Navbar({ contentWidthClassName = 'max-w-content' }) {
  const { user, logout } = useAuth()
  const displayName = user?.firstName || user?.name

  return (
    <header className="border-b border-divider bg-white/95 backdrop-blur-sm">
      <div className={`mx-auto grid w-full ${contentWidthClassName} grid-cols-[1fr_auto_1fr] items-center px-section-x py-4 md:flex md:justify-between`.trim()}>
        <div className="justify-self-start md:hidden">
          <button
            aria-label={navbarCopy.mobileMenuAriaLabel}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-transparent transition-colors duration-200 hover:border-divider focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            type="button"
          >
            <LuMenu aria-hidden="true" className="h-5 w-5 text-heading" />
          </button>
        </div>

        <a
          href="/"
          aria-label={navbarCopy.homeLinkAriaLabel}
          className="inline-flex justify-self-center rounded-logo focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 md:justify-self-auto"
        >
          <img alt={navbarCopy.logoAlt} className="h-8 w-auto" src={gdgLogo} />
        </a>

        <div className="justify-self-end">
          <Popover
            align="right"
            className="w-72 border border-divider bg-white p-0 shadow-none"
            trigger={
              <button
                aria-label={navbarCopy.profileMenuAriaLabel}
                className="inline-flex items-center rounded-full border border-transparent p-1 transition-colors duration-200 hover:border-divider focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                type="button"
              >
                <ProfileAvatar name={displayName} />
              </button>
            }
          >
            {({ close }) => (
              <div role="menu" className="overflow-hidden rounded-dialog bg-white">
                {user ? (
                  <div className="border-b border-divider px-4 py-3">
                    <p className="text-sm font-semibold text-heading">{displayName}</p>
                    <p className="mt-1 text-sm text-muted">{user.email}</p>
                  </div>
                ) : (
                  <div className="border-b border-divider px-4 py-3">
                    <p className="text-sm font-semibold text-heading">
                      {navbarCopy.unknownUserLabel}
                    </p>
                  </div>
                )}

                {user ? (
                  <div className="p-2">
                    <button
                      className="flex w-full items-center justify-between rounded-button px-4 py-3 text-left text-sm font-medium text-error transition hover:bg-error-bg/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-error/30"
                      role="menuitem"
                      type="button"
                      onClick={async () => {
                        close()
                        await logout()
                      }}
                    >
                      <span>{navbarCopy.logoutLabel}</span>
                    </button>
                  </div>
                ) : null}
              </div>
            )}
          </Popover>
        </div>
      </div>
    </header>
  )
}
