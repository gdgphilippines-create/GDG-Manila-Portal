export default function PageShell({ children, centered = false }) {
  const layoutClassName = centered
    ? 'flex items-center justify-center'
    : ''

  return (
    <main className={`min-h-screen px-6 py-12 text-[#3C4043] md:px-12 ${layoutClassName}`.trim()}>
      {children}
    </main>
  )
}
