import { LuChevronDown } from 'react-icons/lu'

export default function EventHeader({
  description,
  isDescriptionExpanded = false,
  onToggleDescription,
  title,
  toggleDescriptionLabel = 'Toggle description',
}) {
  return (
    <section className="lg:col-span-8 lg:pr-6" data-purpose="event-header">
      <h1 className="type-heading">
        {title}
      </h1>
      <p className="type-body mt-5 max-w-3xl">
        {description}
      </p>
      {onToggleDescription ? (
        <button
          aria-expanded={isDescriptionExpanded}
          aria-label={toggleDescriptionLabel}
          className="mt-6 inline-flex items-center justify-center text-slate-400 transition hover:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25"
          onClick={onToggleDescription}
          type="button"
        >
          <LuChevronDown
            aria-hidden="true"
            className={`h-5 w-5 transition-transform duration-200 ${isDescriptionExpanded ? 'rotate-180' : 'rotate-0'}`.trim()}
          />
        </button>
      ) : null}
    </section>
  )
}
