const toneClassNames = {
  amber:
    'border-[#fbbc04]/30 bg-[#fbbc04]/10 hover:border-[#fbbc04]/60 hover:bg-[#fbbc04]/16 text-[#b06000]',
  emerald:
    'border-[#34a853]/30 bg-[#34a853]/10 hover:border-[#34a853]/60 hover:bg-[#34a853]/16 text-[#137333]',
  rose:
    'border-[#ea4335]/30 bg-[#ea4335]/10 hover:border-[#ea4335]/60 hover:bg-[#ea4335]/16 text-[#c5221f]',
}

export default function ActionButton({ action, disabled, onSelect }) {
  const toneClassName = toneClassNames[action.tone] ?? toneClassNames.amber

  return (
    <button
      className={`rounded-2xl border px-5 py-5 text-left transition duration-200 hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-60 ${toneClassName}`}
      disabled={disabled}
      onClick={() => onSelect(action.view)}
      type="button"
    >
      <span className="block text-sm font-medium uppercase tracking-wide">{action.label}</span>
      <span className="mt-2 block text-lg font-medium text-[#202124]">{action.description}</span>
    </button>
  )
}
