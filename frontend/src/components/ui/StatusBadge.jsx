export default function StatusBadge({ children }) {
  return (
    <span className="type-label inline-flex rounded-full border border-divider bg-card px-5 py-2">
      {children}
    </span>
  )
}
