import { tonePatterns } from '@/styles/theme'

export default function ActionButton({ action, disabled, onSelect }) {
  const toneClassName =
    tonePatterns.accentActionClassNames[action.tone] ?? tonePatterns.accentActionClassNames.amber

  return (
    <button
      className={`rounded-button border px-card-x py-5 text-left transition duration-200 disabled:cursor-not-allowed disabled:opacity-60 ${toneClassName}`}
      disabled={disabled}
      onClick={() => onSelect(action.view)}
      type="button"
    >
      <span className="type-label block">{action.label}</span>
      <span className="type-body mt-2 block text-heading">{action.description}</span>
    </button>
  )
}
