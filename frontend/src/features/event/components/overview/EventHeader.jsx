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
      <h1 className="font-display text-4xl font-bold tracking-tight text-heading md:text-5xl">
        {title}
      </h1>
      <p className="mt-5 max-w-3xl text-lg leading-8 text-body">
        {description}
      </p>
      {onToggleDescription ? (
        <button
          aria-expanded={isDescriptionExpanded}
          aria-label={toggleDescriptionLabel}
          className="mt-6 inline-flex h-11 w-11 items-center justify-center rounded-full border border-divider bg-white text-muted transition hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25"
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
