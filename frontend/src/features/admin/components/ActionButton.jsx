const toneClassNames = {
  amber:
    'border-warning/30 bg-warning/10 text-warning-text hover:border-warning/60 hover:bg-warning/15',
  emerald:
    'border-success/30 bg-success/10 text-success-text hover:border-success/60 hover:bg-success/15',
  rose:
    'border-danger/30 bg-danger/10 text-danger-text hover:border-danger/60 hover:bg-danger/15',
}

export default function ActionButton({ action, disabled, onSelect }) {
  const toneClassName = toneClassNames[action.tone] ?? toneClassNames.amber

  return (
    <button
      className={`rounded-button border px-card-x py-5 text-left shadow-session transition duration-200 hover:shadow-card disabled:cursor-not-allowed disabled:opacity-60 ${toneClassName}`}
      disabled={disabled}
      onClick={() => onSelect(action.view)}
      type="button"
    >
      <span className="type-label block">{action.label}</span>
      <span className="type-body mt-2 block text-heading">{action.description}</span>
    </button>
  )
}
