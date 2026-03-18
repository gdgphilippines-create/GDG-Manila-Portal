export default function FormField({ children, error, label }) {
  return (
    <label className="block">
      <span className="type-label">{label}</span>
      <div className="mt-2">{children}</div>
      {error ? <p className="type-meta mt-2 text-error">{error}</p> : null}
    </label>
  )
}
