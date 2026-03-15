export default function SectionHeader({ eyebrow, title, description, align = 'left' }) {
  const textAlignment = align === 'center' ? 'text-center' : 'text-left'
  const descriptionWidth = align === 'center' ? 'mx-auto max-w-sm' : 'max-w-2xl'

  return (
    <header className={textAlignment}>
      {eyebrow ? (
        <p className="text-sm uppercase tracking-[0.18em] text-[#5f6368]">{eyebrow}</p>
      ) : null}
      <h1 className="mt-3 text-3xl font-medium leading-tight tracking-[-0.03em] text-[#202124] md:text-5xl">
        {title}
      </h1>
      {description ? (
        <p className={`mt-5 text-lg leading-relaxed text-[#5f6368] ${descriptionWidth}`}>{description}</p>
      ) : null}
    </header>
  )
}
