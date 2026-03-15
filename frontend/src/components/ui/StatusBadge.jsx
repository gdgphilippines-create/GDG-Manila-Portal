export default function StatusBadge({ children }) {
  return (
    <span className="inline-flex rounded-full border border-[#dadce0] bg-white px-5 py-2 text-xs font-medium uppercase tracking-[0.1em] text-[#5f6368]">
      {children}
    </span>
  )
}
