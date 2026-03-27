const toneClassNames = {
  'cloud-native': 'border-primary/20 bg-primary/10 text-primary',
  firebase: 'border-secondary/20 bg-secondary/10 text-secondary',
  flutter: 'border-warning/20 bg-warning-bg text-warning',
  'generative-ai': 'border-error/20 bg-error-bg text-error',
  'web-perf': 'border-success/20 bg-success-bg text-success',
}

export default function TagBadge({ label, tone = 'generative-ai' }) {
  return (
    <span
      className={`inline-flex rounded-lg border px-3 py-1 text-type-caption uppercase tracking-label-wide ${toneClassNames[tone] ?? toneClassNames['generative-ai']}`}
    >
      {label}
    </span>
  )
}
