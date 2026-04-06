import { LuExternalLink, LuPartyPopper, LuStar } from 'react-icons/lu'
import { feedbackForm } from '@/constants/social'

export default function FeedbackCTA() {
  function handleClick() {
    window.open(feedbackForm.href, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="relative pl-8">
      <span
        aria-hidden="true"
        className="absolute left-[6px] top-10 z-10 h-3 w-3 rounded-full border-2 border-success bg-card"
      />

      <article className="overflow-hidden rounded-dialog border border-divider bg-card px-5 py-6 shadow-session">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-success/15">
            <LuPartyPopper aria-hidden="true" className="h-3.5 w-3.5 text-success" />
          </span>
          <span className="rounded-full border border-success/30 bg-success/10 px-3 py-0.5 text-xs font-semibold uppercase tracking-label text-success">
            {feedbackForm.ctaBadge}
          </span>
        </div>

        <h3 className="mt-3 text-type-subheading font-bold tracking-tight text-heading">
          {feedbackForm.ctaTitle}
        </h3>
        <p className="mt-1.5 max-w-lg text-type-body text-body">
          {feedbackForm.ctaDescription}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-xs font-bold text-card transition hover:brightness-95"
            onClick={handleClick}
            type="button"
          >
            <LuStar aria-hidden="true" className="h-3.5 w-3.5" />
            <span>{feedbackForm.ctaButtonLabel}</span>
            <LuExternalLink aria-hidden="true" className="h-3 w-3" />
          </button>
        </div>
      </article>
    </div>
  )
}
