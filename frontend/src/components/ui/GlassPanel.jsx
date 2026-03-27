const variantClassNames = {
  card: 'rounded-card border border-divider',
  dialog: 'surface-dialog rounded-dialog shadow-dropdown',
  auth: 'surface-auth rounded-inner-card border border-divider shadow-none',
}

export default function GlassPanel({ children, className = '', variant = 'card' }) {
  const variantClassName = variantClassNames[variant] ?? variantClassNames.card

  return (
    <section
      className={`w-full overflow-hidden bg-card ${variantClassName} ${className}`.trim()}
    >
      {children}
    </section>
  )
}
