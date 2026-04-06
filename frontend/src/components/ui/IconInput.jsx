import { createElement } from 'react'

export default function IconInput({
  hasError = false,
  icon,
  inputClassName: customInputClassName = '',
  ...props
}) {
  return (
    <div
      className={`flex items-center gap-3 rounded-field border bg-card px-4 py-3 transition focus-within:border-primary/40 ${
        hasError ? 'border-error' : 'border-divider'
      }`}
    >
      {createElement(icon, {
        'aria-hidden': 'true',
        className: 'h-4 w-4 shrink-0 text-muted',
      })}
      <input
        className={`type-body w-full bg-transparent text-heading outline-none placeholder:text-muted ${customInputClassName}`}
        {...props}
      />
    </div>
  )
}
