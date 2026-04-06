export default function TextInput({ hasError = false, className = '', ...props }) {
  return (
    <input
      className={`type-body w-full rounded-field border bg-card px-4 py-3 text-heading outline-none transition focus:border-primary/40 placeholder:text-muted ${
        hasError ? 'border-error' : 'border-divider'
      } ${className}`.trim()}
      {...props}
    />
  )
}
