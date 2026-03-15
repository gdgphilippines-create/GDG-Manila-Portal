import ActionButton from './ActionButton'

export default function ActionGrid({ actions, isPending, onSelect }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {actions.map((action) => (
        <ActionButton action={action} disabled={isPending} key={action.view} onSelect={onSelect} />
      ))}
    </div>
  )
}
