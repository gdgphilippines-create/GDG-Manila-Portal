export default function SectionCard({
  children,
  className = '',
  framed = true,
  title,
  titleClassName = '',
}) {
  const frameClassName = framed ? 'rounded-panel border border-divider bg-card/80 p-5' : ''

  return (
    <section className={`${frameClassName} ${className}`.trim()}>
      {title ? (
        <div className="mb-4">
          <h3 className={`type-subheading text-heading ${titleClassName}`.trim()}>
            {title}
          </h3>
        </div>
      ) : null}
      {children}
    </section>
  )
}
