import { forwardRef } from 'react'

const Textarea = forwardRef(function Textarea({ hasError = false, className = '', ...props }, ref) {
  return (
    <textarea
      className={`type-body min-h-32 w-full resize-y rounded-field border bg-card px-4 py-3 text-heading outline-none transition focus:border-primary/40 placeholder:text-muted ${
        hasError ? 'border-error' : 'border-divider'
      } ${className}`.trim()}
      ref={ref}
      {...props}
    />
  )
})

export default Textarea
