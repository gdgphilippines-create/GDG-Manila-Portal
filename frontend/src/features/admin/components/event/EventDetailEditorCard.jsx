import { createElement, useId, useRef } from 'react'
import { TextDropTextarea } from '@/components/ui'
import { LuCalendarDays, LuImage, LuMapPin, LuTrash2, LuUpload } from 'react-icons/lu'

function formatDateForInput(value) {
  const parsedDate = new Date(value)

  if (Number.isNaN(parsedDate.getTime())) {
    return ''
  }

  const year = parsedDate.getFullYear()
  const month = String(parsedDate.getMonth() + 1).padStart(2, '0')
  const day = String(parsedDate.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function formatDateForDisplay(value) {
  if (!value) {
    return ''
  }

  const [year, month, day] = value.split('-').map(Number)
  const parsedDate = new Date(year, (month ?? 1) - 1, day ?? 1)

  if (Number.isNaN(parsedDate.getTime())) {
    return ''
  }

  return parsedDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function FieldLabel({ children }) {
  return (
    <span className="text-type-caption uppercase tracking-label text-body">
      {children}
    </span>
  )
}

function UnderlineInput({ className = '', ...props }) {
  return (
    <input
      className={`w-full border-b border-divider bg-transparent px-0 py-2 text-type-field text-heading outline-none transition focus:border-primary placeholder:text-muted ${className}`.trim()}
      {...props}
    />
  )
}

function UnderlineIconInput({
  icon: Icon,
  className = '',
  inputClassName = '',
  inputRef,
  onContainerClick,
  ...props
}) {
  return (
    <div
      className={`flex items-center gap-2.5 border-b border-divider py-2 transition focus-within:border-primary ${className}`.trim()}
      onClick={onContainerClick}
    >
      {createElement(Icon, {
        'aria-hidden': 'true',
        className: 'h-4 w-4 shrink-0 text-muted',
      })}
      <input
        className={`w-full bg-transparent px-0 text-type-field text-heading outline-none placeholder:text-muted ${inputClassName}`.trim()}
        ref={inputRef}
        {...props}
      />
    </div>
  )
}

export default function EventDetailEditorCard({ draft, onChange, onSave }) {
  const headerImageInputId = useId()
  const dateInputRef = useRef(null)

  function updateField(field, value) {
    onChange((currentDraft) => ({ ...currentDraft, [field]: value }))
  }

  function handleHeaderImageUpload(event) {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        updateField('heroImageUrl', reader.result)
      }
    }
    reader.readAsDataURL(file)
    event.target.value = ''
  }

  function handleDateFieldClick() {
    const input = dateInputRef.current

    if (!input) {
      return
    }

    input.focus()
    input.showPicker?.()
  }

  return (
    <section className="space-y-3">
      <div>
        <FieldLabel>Header Image</FieldLabel>
        <div className="mt-2 rounded-dialog border border-divider bg-card p-2.5">
          <div className="relative">
            <label
              className="group relative flex h-[176px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-panel bg-footer text-muted transition hover:brightness-[0.98]"
              htmlFor={headerImageInputId}
              title={draft.heroImageUrl ? 'Change header image' : 'Upload header image'}
            >
              {draft.heroImageUrl ? (
                <img
                  alt={draft.title ? `${draft.title} banner` : 'Event header banner'}
                  className="h-full w-full object-cover"
                  src={draft.heroImageUrl}
                />
              ) : (
                <span className="flex flex-col items-center gap-3 px-4 text-center">
                  <LuImage aria-hidden="true" className="h-9 w-9" />
                  <span className="text-type-caption uppercase tracking-label text-heading">
                    Upload
                  </span>
                </span>
              )}
            </label>
            <div className="absolute bottom-3 right-3 flex items-center gap-2">
              <label
                aria-label={draft.heroImageUrl ? 'Change header image' : 'Upload header image'}
                className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-card/85 text-body shadow-sm backdrop-blur transition hover:bg-card hover:text-heading"
                htmlFor={headerImageInputId}
                title={draft.heroImageUrl ? 'Change image' : 'Upload image'}
              >
                <LuUpload aria-hidden="true" className="h-4 w-4" />
              </label>
              {draft.heroImageUrl ? (
                <button
                  aria-label="Remove header image"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-card/85 text-body shadow-sm backdrop-blur transition hover:bg-card hover:text-error"
                  onClick={() => updateField('heroImageUrl', '')}
                  title="Remove image"
                  type="button"
                >
                  <LuTrash2 aria-hidden="true" className="h-4 w-4" />
                </button>
              ) : null}
            </div>
          </div>
          <input
            accept="image/*"
            className="sr-only"
            id={headerImageInputId}
            onChange={handleHeaderImageUpload}
            type="file"
          />
        </div>
      </div>

      <label className="block">
        <FieldLabel>Headline</FieldLabel>
        <div className="mt-2">
          <UnderlineInput
            onChange={(event) => updateField('title', event.target.value)}
            placeholder="Enter event headline"
            value={draft.title}
          />
        </div>
      </label>

      <label className="block">
        <FieldLabel>Description</FieldLabel>
        <div className="mt-2">
          <TextDropTextarea
            dropHint=""
            onValueChange={(value) => updateField('description', value)}
            rows={3}
            textareaClassName="min-h-20 text-type-field"
            value={draft.description}
          />
        </div>
      </label>

      <label className="block">
        <FieldLabel>Location</FieldLabel>
        <div className="mt-2">
          <UnderlineIconInput
            icon={LuMapPin}
            onChange={(event) => updateField('location', event.target.value)}
            placeholder="Enter event location"
            value={draft.location}
          />
        </div>
      </label>

      <label className="block">
        <FieldLabel>Date</FieldLabel>
        <div className="mt-2">
          <UnderlineIconInput
            icon={LuCalendarDays}
            inputClassName="appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
            inputRef={dateInputRef}
            onChange={(event) => updateField('date', formatDateForDisplay(event.target.value))}
            onContainerClick={handleDateFieldClick}
            type="date"
            value={formatDateForInput(draft.date)}
          />
        </div>
      </label>

      <div className="pt-1">
        <button
          className="w-full rounded-full bg-primary px-5 py-2.5 text-xs font-semibold uppercase tracking-label text-card transition hover:brightness-95"
          onClick={onSave}
          type="button"
        >
          Save
        </button>
      </div>
    </section>
  )
}
