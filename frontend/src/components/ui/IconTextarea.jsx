import { createElement } from 'react'

export default function IconTextarea({ hasError = false, icon, ...props }) {
  return (
    <div
      className={`flex gap-3 rounded-field border bg-card px-4 py-3 transition focus-within:border-primary/40 ${
        hasError ? 'border-error' : 'border-divider'
      }`}
    >
      {createElement(icon, {
        'aria-hidden': 'true',
        className: 'mt-0.5 h-4 w-4 shrink-0 text-muted',
      })}
      <textarea
        className="type-body min-h-28 w-full resize-y bg-transparent text-heading outline-none placeholder:text-muted"
        {...props}
      />
    </div>
  )
}
