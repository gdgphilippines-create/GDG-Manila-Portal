import Navbar from './Navbar'

const NAVBAR_SPACER_CLASS_NAME = 'h-[5.5rem]'

export default function PageShell({
  children,
  centered = false,
  showNavbar = true,
  navbarContentClassName,
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
          <div aria-hidden="true" className={NAVBAR_SPACER_CLASS_NAME} />
        </>
      ) : null}
      <main className={`layout-page text-body ${layoutClassName}`.trim()}>
        <div className={contentClassName}>
          {children}
        </div>
      </main>
    </>
  )
}
