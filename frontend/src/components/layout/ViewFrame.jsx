export default function ViewFrame({ children, className = '' }) {
  return (
    <section className={`mx-auto w-full max-w-content ${className}`.trim()}>
      {children}
    </section>
  )
}
