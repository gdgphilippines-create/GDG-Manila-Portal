import ActionButton from './ActionButton'

export default function ActionGrid({ actions, activeView, isPending, onSelect }) {
  return (
    <div className="grid gap-3 rounded-[28px] bg-footer p-2 md:grid-cols-3">
      {actions.map((action) => (
        <ActionButton
          action={action}
          active={action.view === activeView}
          disabled={isPending}
          key={action.view}
          onSelect={onSelect}
        />
      ))}
    </div>
  )
}
