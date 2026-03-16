import { LuChevronRight } from 'react-icons/lu'

const defaultReadMoreLabel = 'Read full description'

export default function EventHeader({
  description,
  onReadMore,
  readMoreLabel = defaultReadMoreLabel,
  title,
}) {
  return (
    <section className="lg:col-span-8" data-purpose="event-header">
      <h1 className="font-display text-4xl font-bold tracking-tight text-heading md:text-5xl">
        {title}
      </h1>
      <p className="mt-6 max-w-3xl text-lg leading-relaxed text-muted">
        {description}
      </p>
      {onReadMore ? (
        <button
          className="mt-4 inline-flex items-center gap-1 font-medium text-primary transition hover:underline"
          onClick={onReadMore}
          type="button"
        >
          <span>{readMoreLabel}</span>
          <LuChevronRight aria-hidden="true" className="h-4 w-4" />
        </button>
      ) : null}
    </section>
  )
}
