import { LuChevronRight } from 'react-icons/lu'

const defaultReadMoreLabel = 'Read full description'

export default function EventHeader({
  description,
  onReadMore,
  readMoreLabel = defaultReadMoreLabel,
  title,
}) {
  return (
    <section className="lg:col-span-8 lg:pr-6" data-purpose="event-header">
      <h1 className="font-display text-4xl font-bold tracking-tight text-heading md:text-5xl">
        {title}
      </h1>
      <p className="mt-5 max-w-3xl text-lg leading-8 text-body">
        {description}
      </p>
      {onReadMore ? (
        <button
          className="mt-6 inline-flex items-center gap-2 rounded-full border border-divider bg-white px-4 py-2.5 text-sm font-semibold text-heading shadow-sm transition hover:border-primary/40 hover:bg-primary/5 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25"
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
