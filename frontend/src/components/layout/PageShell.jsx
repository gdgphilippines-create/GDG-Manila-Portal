import Navbar from './Navbar'

const NAVBAR_SPACER_CLASS_NAME = 'h-[5.5rem]'

export default function PageShell({
  children,
  centered = false,
  showNavbar = true,
  navbarContentClassName,
  navbarSpacerClassName = NAVBAR_SPACER_CLASS_NAME,
  mainClassName = '',
}) {
  const layoutClassName = centered ? 'flex items-center justify-center' : ''
  const contentClassName = centered
    ? 'layout-content flex-1 items-center justify-center'
    : 'layout-content'

  return (
    <>
      {showNavbar ? (
        <>
          <Navbar contentWidthClassName={navbarContentClassName} />
          <div aria-hidden="true" className={navbarSpacerClassName} />
        </>
      ) : null}
      <main className={`layout-page text-body ${layoutClassName} ${mainClassName}`.trim()}>
        <div className={contentClassName}>
          {children}
        </div>
      </main>
    </>
  )
}
