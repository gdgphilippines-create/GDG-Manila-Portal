export default function GlassPanel({ children, className = '' }) {
  return (
    <section
      className={`w-full overflow-hidden rounded-[24px] border border-white bg-white shadow-[0_1px_3px_rgba(60,64,67,0.3),0_4px_8px_3px_rgba(60,64,67,0.15)] ${className}`.trim()}
    >
      {children}
    </section>
  )
}
