export default function SectionHeader({ eyebrow, title, description, align = 'left' }) {
  const textAlignment = align === 'center' ? 'text-center' : 'text-left'
  const descriptionWidth = align === 'center' ? 'mx-auto max-w-sm' : 'max-w-2xl'

  return (
    <header className={textAlignment}>
      {eyebrow ? (
        <p className="type-label">{eyebrow}</p>
      ) : null}
      <h1 className="type-hero mt-3">
        {title}
      </h1>
      {description ? (
        <p className={`type-body mt-5 text-muted ${descriptionWidth}`}>{description}</p>
      ) : null}
    </header>
  )
}
