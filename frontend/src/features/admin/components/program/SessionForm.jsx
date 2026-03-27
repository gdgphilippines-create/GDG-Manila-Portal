import { useEffect, useId, useMemo, useState } from 'react'
import { FormField, Popover, SectionCard, TextDropTextarea, TextInput } from '@/components/ui'
import {
  LuCheck,
  LuChevronDown,
  LuCode,
  LuImage,
  LuLink2,
  LuPlus,
  LuTrash2,
} from 'react-icons/lu'
import {
  builtInSessionTypes,
  createAction,
  getSessionTypeTone,
  normalizeSession,
  removeActionById,
  updateActionById,
} from './sessionFormUtils'

function formatTimeForInput(value) {
  const match = String(value || '').trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i)

  if (!match) {
    return ''
  }

  let hours = Number(match[1]) % 12
  const minutes = match[2]
  const meridiem = match[3].toUpperCase()

  if (meridiem === 'PM') {
    hours += 12
  }

  return `${String(hours).padStart(2, '0')}:${minutes}`
}

function formatTimeForDisplay(value) {
  const match = String(value || '').trim().match(/^(\d{2}):(\d{2})$/)

  if (!match) {
    return ''
  }

  const rawHours = Number(match[1])
  const minutes = match[2]
  const meridiem = rawHours >= 12 ? 'PM' : 'AM'
  const hours = rawHours % 12 || 12

  return `${String(hours).padStart(2, '0')}:${minutes} ${meridiem}`
}

function getTypeOptionLabel(typeOption) {
  return typeOption.value === 'custom' ? 'New Type' : typeOption.label
}

function getSelectedTypeLabel(sessionType, customSessionType) {
  if (sessionType === 'custom') {
    return customSessionType?.trim() || 'New Type'
  }

  const nextSelectedType = builtInSessionTypes.find((typeOption) => typeOption.value === sessionType)
  return nextSelectedType
    ? getTypeOptionLabel(nextSelectedType)
    : getTypeOptionLabel(builtInSessionTypes[0])
}

function TypePicker({
  hasError = false,
  customSessionType = '',
  sessionType,
  onSelect,
  onSubmitCustomType,
}) {
  const selectedLabel = getSelectedTypeLabel(sessionType, customSessionType)
  const selectedTone = getSessionTypeTone(sessionType, customSessionType)
  const customTypeTone = getSessionTypeTone('custom', customSessionType)
  const [customTypeDraft, setCustomTypeDraft] = useState(customSessionType)
  const [isAddingCustomType, setIsAddingCustomType] = useState(false)

  useEffect(() => {
    setCustomTypeDraft(customSessionType)
  }, [customSessionType])

  function handleCustomTypeSubmit(close) {
    const nextValue = customTypeDraft.trim()

    if (!nextValue) {
      return
    }

    onSubmitCustomType(nextValue)
    setIsAddingCustomType(false)
    close()
  }

  return (
    <Popover
      align="left"
      className="w-[min(16rem,calc(100vw-2rem))] p-3"
      trigger={(
        <button
          className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm transition hover:border-primary/30 ${
            hasError
              ? 'border-error bg-card text-heading'
              : selectedTone.trigger
          }`.trim()}
          type="button"
        >
          <span className="flex min-w-0 items-center gap-2">
            <span
              aria-hidden="true"
              className={`h-2.5 w-2.5 rounded-full ${selectedTone.dot}`.trim()}
            />
            <span className="truncate whitespace-nowrap text-sm font-medium text-heading">
              {selectedLabel}
            </span>
          </span>
          <LuChevronDown aria-hidden="true" className="h-4 w-4 text-current/70" />
        </button>
      )}
    >
      {({ close }) => (
        <div className="space-y-3">
          <p className="px-1 font-label text-type-caption uppercase tracking-label text-muted">
            Session Type
          </p>
          <div className="flex flex-col gap-2">
            {builtInSessionTypes.filter((typeOption) => typeOption.value !== 'custom').map((typeOption) => {
              const isSelected = typeOption.value === sessionType
              const tone = getSessionTypeTone(typeOption.value)

              return (
                <button
                  className={`inline-flex w-full items-center justify-between gap-3 rounded-2xl border px-3 py-2 text-xs font-semibold uppercase tracking-label transition ${
                    isSelected ? tone.selected : tone.surface
                  }`.trim()}
                  key={typeOption.value}
                  onClick={() => {
                    onSelect(typeOption.value)
                    close()
                  }}
                  type="button"
                >
                  <span className="flex min-w-0 items-center gap-2">
                    <span
                      aria-hidden="true"
                      className={`h-2 w-2 rounded-full ${tone.dot}`.trim()}
                    />
                    <span className="truncate">{getTypeOptionLabel(typeOption)}</span>
                  </span>
                  {isSelected ? <LuCheck aria-hidden="true" className="h-3.5 w-3.5 shrink-0" /> : null}
                </button>
              )
            })}
          </div>

          {sessionType === 'custom' && customSessionType.trim() ? (
            <button
              className={`inline-flex w-full items-center justify-between gap-3 rounded-2xl border px-3 py-2 text-xs font-semibold uppercase tracking-label transition ${customTypeTone.selected}`.trim()}
              onClick={() => {
                setCustomTypeDraft(customSessionType)
                setIsAddingCustomType(true)
              }}
              type="button"
            >
              <span className="flex min-w-0 items-center gap-2">
                <span
                  aria-hidden="true"
                  className={`h-2 w-2 rounded-full ${customTypeTone.dot}`.trim()}
                />
                <span className="truncate">{customSessionType}</span>
              </span>
              <LuCheck aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
            </button>
          ) : null}

          <div className="rounded-2xl border border-dashed border-divider bg-footer/60 p-2">
            {isAddingCustomType ? (
              <input
                autoFocus
                className="type-body w-full rounded-xl border border-divider bg-card px-3 py-2 text-sm text-heading outline-none transition focus:border-primary/35"
                onChange={(event) => setCustomTypeDraft(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault()
                    handleCustomTypeSubmit(close)
                  }

                  if (event.key === 'Escape') {
                    setIsAddingCustomType(false)
                    setCustomTypeDraft(customSessionType)
                  }
                }}
                placeholder="Type a custom tag and press Enter"
                value={customTypeDraft}
              />
            ) : (
              <button
                className="flex w-full items-center gap-2 rounded-xl px-2 py-2 text-left text-sm font-medium text-muted transition hover:bg-card hover:text-heading"
                onClick={() => {
                  setCustomTypeDraft(customSessionType)
                  setIsAddingCustomType(true)
                }}
                type="button"
              >
                <LuPlus aria-hidden="true" className="h-4 w-4" />
                <span className="whitespace-nowrap">Tag</span>
              </button>
            )}
          </div>
        </div>
      )}
    </Popover>
  )
}

function ResourceRow({ error, href, icon, placeholder, onChange, onRemove }) {
  const ResourceIcon = icon

  return (
    <div>
      <div
        className={`flex items-center gap-3 border-b bg-transparent py-2 ${
          error ? 'border-error' : 'border-divider'
        }`}
      >
        <ResourceIcon aria-hidden="true" className="h-4 w-4 shrink-0 text-muted" />
        <input
          className="type-body w-full bg-transparent text-heading outline-none placeholder:text-muted"
          onChange={onChange}
          placeholder={placeholder}
          value={href}
        />
        <button
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted transition hover:text-error"
          onClick={onRemove}
          type="button"
        >
          <LuTrash2 aria-hidden="true" className="h-4 w-4" />
        </button>
      </div>
      {error ? <p className="mt-2 text-sm text-error">{error}</p> : null}
    </div>
  )
}

function validateSession(session) {
  const errors = {}
  const isBreak = session.sessionType === 'break'

  if (!isBreak && !session.speakerName?.trim()) {
    errors.speakerName = 'Speaker name is required.'
  }

  if (!session.schedule?.startTime?.trim()) {
    errors.startTime = 'Start time is required.'
  }

  if (!session.schedule?.endTime?.trim()) {
    errors.endTime = 'End time is required.'
  }

  if (!session.sessionType?.trim()) {
    errors.sessionType = 'Type is required.'
  }

  if (session.sessionType === 'custom' && !session.customSessionType?.trim()) {
    errors.customSessionType = 'Custom type is required.'
  }

  if (!session.title?.trim()) {
    errors.title = 'Session title is required.'
  }

  return errors
}

function findResourceAction(session, labelKey) {
  return (session.actions ?? []).find((action) => action.labelKey === labelKey) ?? createAction(labelKey, { href: '' })
}

function upsertResourceAction(session, labelKey, href) {
  const existingAction = (session.actions ?? []).find((action) => action.labelKey === labelKey)

  if (existingAction) {
    return updateActionById(session, existingAction.id, href)
  }

  return {
    ...session,
    actions: [...(session.actions ?? []), createAction(labelKey, { href })],
  }
}

export default function SessionForm({
  onChange,
  onCancel,
  onDelete,
  deleteDisabled = false,
  deleteTooltip = 'Delete not yet supported.',
  onSave,
  saveLabel = 'Save',
  session,
}) {
  const speakerImageInputId = useId()
  const [touched, setTouched] = useState(false)
  const normalizedSession = normalizeSession(session)
  const slidesAction = findResourceAction(normalizedSession, 'slides')
  const codelabAction = findResourceAction(normalizedSession, 'startCodelab')
  const errors = useMemo(
    () => (touched ? validateSession(normalizedSession) : {}),
    [normalizedSession, touched],
  )

  useEffect(() => {
    if (!onCancel) {
      return undefined
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        event.preventDefault()
        onCancel()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onCancel])

  function updateSession(nextSession) {
    onChange(normalizeSession(nextSession))
  }

  function updateField(field, value) {
    updateSession({
      ...normalizedSession,
      [field]: value,
    })
  }

  function updateSchedule(field, value) {
    updateSession({
      ...normalizedSession,
      schedule: {
        ...normalizedSession.schedule,
        [field]: value,
      },
    })
  }

  function handleTypeChange(value) {
    updateSession({
      ...normalizedSession,
      customSessionType: value === 'custom' ? normalizedSession.customSessionType : '',
      sessionType: value,
      type: value === 'break' ? 'break' : 'session',
    })
  }

  function handleCustomTypeSubmit(value) {
    updateSession({
      ...normalizedSession,
      customSessionType: value,
      sessionType: 'custom',
      type: 'session',
    })
  }

  function handleSpeakerImageUpload(event) {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        updateField('speakerImageUrl', reader.result)
      }
    }
    reader.readAsDataURL(file)
    event.target.value = ''
  }

  function handleSave() {
    setTouched(true)
    const nextErrors = validateSession(normalizedSession)

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    onSave(normalizedSession)
  }

  return (
    <div className="space-y-4 p-4">
        <SectionCard framed={false}>
          <div className="grid gap-4">
            <FormField error={errors.title} label="Session Title">
              <TextInput
                hasError={Boolean(errors.title)}
                onChange={(event) => updateField('title', event.target.value)}
                placeholder="Enter session title"
                value={normalizedSession.title}
              />
            </FormField>

            <FormField error={errors.description} label="Description (Optional)">
              <TextDropTextarea
                dropHint=""
                hasError={Boolean(errors.description)}
                onValueChange={(value) => updateField('description', value)}
                placeholder="Write a short session description"
                rows={3}
                textareaClassName="min-h-20"
                value={normalizedSession.description ?? ''}
              />
            </FormField>
          </div>
        </SectionCard>

        <div className="border-t border-divider/70" />

        <SectionCard framed={false}>
          <div className="grid gap-3">
            <div className="flex flex-wrap items-start gap-3">
              <div className="min-w-0 flex-none basis-[8.5rem]">
                <FormField error={errors.startTime} label="Start Time">
                  <TextInput
                    className="min-w-0 whitespace-nowrap appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                    hasError={Boolean(errors.startTime)}
                    onChange={(event) => updateSchedule('startTime', formatTimeForDisplay(event.target.value))}
                    type="time"
                    value={formatTimeForInput(normalizedSession.schedule.startTime)}
                  />
                </FormField>
              </div>

              <div className="min-w-0 flex-none basis-[8.5rem]">
                <FormField error={errors.endTime} label="End Time">
                  <TextInput
                    className="min-w-0 whitespace-nowrap appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                    hasError={Boolean(errors.endTime)}
                    onChange={(event) => updateSchedule('endTime', formatTimeForDisplay(event.target.value))}
                    type="time"
                    value={formatTimeForInput(normalizedSession.schedule.endTime)}
                  />
                </FormField>
              </div>

              <div className="min-w-0 flex-none basis-[11rem]">
                <FormField error={errors.sessionType} label="Type">
                  <div className="space-y-3">
                    <TypePicker
                      customSessionType={normalizedSession.customSessionType}
                      hasError={Boolean(errors.sessionType)}
                      onSelect={handleTypeChange}
                      onSubmitCustomType={handleCustomTypeSubmit}
                      sessionType={normalizedSession.sessionType}
                    />
                  </div>
                </FormField>
              </div>
            </div>
            {errors.customSessionType && normalizedSession.sessionType === 'custom' ? (
              <p className="text-sm text-error">{errors.customSessionType}</p>
            ) : null}
          </div>
        </SectionCard>

        <div className="border-t border-divider/70" />

        <SectionCard framed={false}>
          <div className="space-y-2">
            <div className="grid gap-3 md:grid-cols-[72px_minmax(0,1fr)] xl:grid-cols-[72px_minmax(0,1.15fr)_minmax(0,0.9fr)] md:items-center">
              <div className="flex items-center gap-2">
                <label
                  className="group relative flex h-16 w-16 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-divider bg-card text-muted transition hover:border-primary/30 hover:text-primary"
                  htmlFor={speakerImageInputId}
                  title={normalizedSession.speakerImageUrl ? 'Change speaker photo' : 'Upload speaker photo'}
                >
                  {normalizedSession.speakerImageUrl ? (
                    <>
                      <img
                        alt={normalizedSession.speakerName ? `${normalizedSession.speakerName} profile` : 'Speaker profile'}
                        className="h-full w-full object-cover transition group-hover:opacity-30"
                        src={normalizedSession.speakerImageUrl}
                      />
                      <span className="absolute inset-0 bg-error/40 opacity-0 transition group-hover:opacity-100" />
                    </>
                  ) : (
                    <LuImage aria-hidden="true" className="h-4.5 w-4.5" />
                  )}
                  {normalizedSession.speakerImageUrl ? (
                    <button
                      aria-label="Remove speaker photo"
                      className="absolute inset-0 inline-flex items-center justify-center text-card opacity-0 transition group-hover:opacity-100"
                      onClick={(event) => {
                        event.preventDefault()
                        event.stopPropagation()
                        updateField('speakerImageUrl', '')
                      }}
                      title="Remove speaker photo"
                      type="button"
                    >
                      <LuTrash2 aria-hidden="true" className="h-4 w-4" />
                    </button>
                  ) : null}
                </label>
                <input
                  accept="image/*"
                  className="sr-only"
                  id={speakerImageInputId}
                  onChange={handleSpeakerImageUpload}
                  type="file"
                />
              </div>

              <TextInput
                hasError={Boolean(errors.speakerName)}
                onChange={(event) => updateField('speakerName', event.target.value)}
                placeholder="Speaker name"
                value={normalizedSession.speakerName ?? ''}
              />

              <div className="flex items-center gap-2 md:col-start-2 xl:col-start-auto">
                <TextInput
                  hasError={Boolean(errors.speakerRole)}
                  onChange={(event) => updateField('speakerRole', event.target.value)}
                  placeholder="Role"
                  value={normalizedSession.speakerRole ?? ''}
                />
              </div>
            </div>

            {errors.speakerName ? <p className="text-sm text-error">{errors.speakerName}</p> : null}
          </div>
        </SectionCard>

        <div className="border-t border-divider/70" />

        <SectionCard framed={false}>
          <div className="space-y-2">
            <ResourceRow
              error={errors[`resource:${slidesAction.id}`]}
              href={slidesAction.href ?? ''}
              icon={LuLink2}
              onChange={(event) => updateSession(upsertResourceAction(normalizedSession, 'slides', event.target.value))}
              onRemove={() => updateSession(removeActionById(normalizedSession, slidesAction.id))}
              placeholder="Slides link"
            />
            <ResourceRow
              error={errors[`resource:${codelabAction.id}`]}
              href={codelabAction.href ?? ''}
              icon={LuCode}
              onChange={(event) => updateSession(upsertResourceAction(normalizedSession, 'startCodelab', event.target.value))}
              onRemove={() => updateSession(removeActionById(normalizedSession, codelabAction.id))}
              placeholder="Codelab link"
            />
          </div>
        </SectionCard>

      <div className="mt-4 grid gap-3 border-t border-divider/70 pt-4 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-center">
        <div className="flex gap-2">
          {onDelete ? (
            <button
              aria-label="Delete session"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-error/20 bg-error-bg text-error transition hover:border-error/40"
              disabled={deleteDisabled}
              onClick={onDelete}
              title={deleteDisabled ? deleteTooltip : undefined}
              type="button"
            >
              <LuTrash2 aria-hidden="true" className="h-4 w-4" />
            </button>
          ) : null}
        </div>

        <div className="flex gap-2 sm:justify-self-end">
          <button
            className="w-full whitespace-nowrap rounded-full bg-primary px-7 py-2 text-xs font-semibold uppercase tracking-label text-card transition hover:brightness-95 sm:w-auto"
            onClick={handleSave}
            type="button"
          >
            {saveLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
