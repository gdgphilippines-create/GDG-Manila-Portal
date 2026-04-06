export default function TonePill({ children, className = '', icon = null }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-pill border px-4 py-2 ${className}`.trim()}
    >
      {icon}
      <span className="font-label text-type-caption font-semibold uppercase tracking-label text-inherit">
        {children}
      </span>
    </span>
  )
}
