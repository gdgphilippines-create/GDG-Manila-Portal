import { useId, useMemo, useState } from 'react'
import { FormField, IconInput, Popover, SectionCard, TextInput, Textarea } from '@/components/ui'
import {
  LuCalendarDays,
  LuCheck,
  LuClock3,
  LuChevronDown,
  LuImage,
  LuLink2,
  LuPlus,
  LuTrash2,
  LuUserRound,
} from 'react-icons/lu'
import {
  addAction,
  builtInSessionTypes,
  normalizeSession,
  removeActionById,
  updateActionById,
} from './sessionFormUtils'

function formatSessionDateForInput(dateLabel) {
  if (!dateLabel) {
    return ''
  }

  const parsedDate = new Date(`${dateLabel}, ${new Date().getFullYear()}`)

  if (Number.isNaN(parsedDate.getTime())) {
    return ''
  }

  const year = parsedDate.getFullYear()
  const month = String(parsedDate.getMonth() + 1).padStart(2, '0')
  const day = String(parsedDate.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function formatSessionDateForDisplay(value) {
  if (!value) {
    return { dateLabel: '', dayLabel: '' }
  }

  const [year, month, day] = value.split('-').map(Number)
  const parsedDate = new Date(year, (month ?? 1) - 1, day ?? 1)

  if (Number.isNaN(parsedDate.getTime())) {
    return { dateLabel: '', dayLabel: '' }
  }

  return {
    dateLabel: parsedDate.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
    }),
    dayLabel: parsedDate.toLocaleDateString('en-US', {
      weekday: 'long',
    }),
  }
}

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

function TypePicker({ hasError = false, customSessionType = '', sessionType, onSelect }) {
  const selectedLabel = getSelectedTypeLabel(sessionType, customSessionType)

  return (
    <Popover
      align="left"
      className="w-[min(20rem,calc(100vw-3rem))] p-3"
      trigger={(
        <button
          className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm transition hover:border-primary/30 ${
            hasError
              ? 'border-error bg-card text-heading'
              : 'border-primary/20 bg-primary/5 text-heading'
          }`}
          type="button"
        >
          <span className="text-sm font-medium text-heading">{selectedLabel}</span>
          <LuChevronDown aria-hidden="true" className="h-4 w-4 text-muted" />
        </button>
      )}
    >
      {({ close }) => (
        <div className="space-y-2">
          <p className="px-1 font-label text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
            Session Type
          </p>
          <div className="flex flex-wrap gap-2">
            {builtInSessionTypes.map((typeOption) => {
              const isSelected = typeOption.value === sessionType

              return (
                <button
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] transition ${
                    isSelected
                      ? 'border-primary/30 bg-primary/10 text-primary'
                      : 'border-divider bg-card text-heading hover:border-primary/30 hover:text-primary'
                  }`}
                  key={typeOption.value}
                  onClick={() => {
                    onSelect(typeOption.value)
                    close()
                  }}
                  type="button"
                >
                  {isSelected ? <LuCheck aria-hidden="true" className="h-3.5 w-3.5" /> : null}
                  <span>{getTypeOptionLabel(typeOption)}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </Popover>
  )
}

function ResourceRow({ error, href, kind, onChange, onRemove }) {
  return (
    <div className={`rounded-2xl border p-3 ${error ? 'border-error' : 'border-divider'} bg-card`}>
      <div className="flex items-center gap-3">
        <span className="inline-flex items-center gap-2 rounded-full bg-footer px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-heading">
          <LuLink2 aria-hidden="true" className="h-3.5 w-3.5" />
          <span>{kind}</span>
        </span>
        <TextInput
          hasError={Boolean(error)}
          onChange={onChange}
          placeholder={`Paste ${kind.toLowerCase()} link`}
          value={href}
        />
        <button
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-divider text-muted transition hover:text-error"
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

  if (!session.schedule?.dateLabel?.trim()) {
    errors.dateLabel = 'Date is required.'
  }

  if (!isBreak && !session.speakerName?.trim()) {
    errors.speakerName = 'Speaker name is required.'
  }

  if (!isBreak && !session.speakerRole?.trim()) {
    errors.speakerRole = 'Speaker role is required.'
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

  if (!session.description?.trim()) {
    errors.description = 'Description is required.'
  }

  return errors
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
  const errors = useMemo(
    () => (touched ? validateSession(normalizedSession) : {}),
    [normalizedSession, touched],
  )

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

  function updateResource(actionId, href) {
    updateSession(updateActionById(normalizedSession, actionId, href))
  }

  function handleTypeChange(value) {
    updateSession({
      ...normalizedSession,
      customSessionType: value === 'custom' ? normalizedSession.customSessionType : '',
      sessionType: value,
      type: value === 'break' ? 'break' : 'session',
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
    <div className="space-y-6 p-5">
        <SectionCard framed={false} title="Speaker">
          <div className="grid gap-5 md:grid-cols-[112px_minmax(0,1fr)] md:items-start">
            <div>
              <label
                className="group relative flex h-28 w-28 cursor-pointer items-center justify-center overflow-hidden rounded-[24px] border border-divider bg-card text-muted transition hover:border-primary/30 hover:text-primary"
                htmlFor={speakerImageInputId}
              >
                {normalizedSession.speakerImageUrl ? (
                  <>
                    <img
                      alt={normalizedSession.speakerName ? `${normalizedSession.speakerName} profile` : 'Speaker profile'}
                      className="h-full w-full object-cover transition duration-200 group-hover:scale-[1.02] group-hover:opacity-30"
                      src={normalizedSession.speakerImageUrl}
                    />
                    <span className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-neutral/40 opacity-0 transition group-hover:opacity-100">
                      <LuPlus aria-hidden="true" className="h-5 w-5 text-card" />
                      <span className="font-label text-[11px] font-semibold uppercase tracking-[0.14em] text-card">
                        Change Photo
                      </span>
                    </span>
                  </>
                ) : (
                  <span className="flex flex-col items-center gap-2 px-3 text-center">
                    <LuImage aria-hidden="true" className="h-8 w-8" />
                    <span className="font-label text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
                      Click to Upload
                    </span>
                  </span>
                )}
              </label>
              <input
                accept="image/*"
                className="sr-only"
                id={speakerImageInputId}
                onChange={handleSpeakerImageUpload}
                type="file"
              />
              {normalizedSession.speakerImageUrl ? (
                <div className="mt-3">
                  <button
                    className="inline-flex items-center gap-2 rounded-full border border-divider px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-heading transition hover:border-error/30 hover:text-error"
                    onClick={() => updateField('speakerImageUrl', '')}
                    type="button"
                  >
                    <LuTrash2 aria-hidden="true" className="h-3.5 w-3.5" />
                    <span>Remove</span>
                  </button>
                </div>
              ) : null}
            </div>

            <div className="grid gap-4">
              <FormField error={errors.speakerName} label="Speaker Name">
                <IconInput
                  hasError={Boolean(errors.speakerName)}
                  icon={LuUserRound}
                  onChange={(event) => updateField('speakerName', event.target.value)}
                  placeholder="Enter speaker name"
                  value={normalizedSession.speakerName ?? ''}
                />
              </FormField>

              <FormField error={errors.speakerRole} label="Role">
                <TextInput
                  hasError={Boolean(errors.speakerRole)}
                  onChange={(event) => updateField('speakerRole', event.target.value)}
                  placeholder="Enter speaker role"
                  value={normalizedSession.speakerRole ?? ''}
                />
              </FormField>
            </div>
          </div>
        </SectionCard>

        <div className="border-t border-divider/70" />

        <SectionCard framed={false} title="Schedule">
          <div className="grid gap-4">
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_14rem]">
              <div className="grid gap-4 md:grid-cols-[minmax(0,1.2fr)_minmax(0,0.9fr)_minmax(0,0.9fr)]">
                <FormField error={errors.dateLabel} label="Date">
                  <IconInput
                    hasError={Boolean(errors.dateLabel)}
                    icon={LuCalendarDays}
                    inputClassName="appearance-none"
                    onChange={(event) => {
                      const nextDate = formatSessionDateForDisplay(event.target.value)
                      updateSession({
                        ...normalizedSession,
                        schedule: {
                          ...normalizedSession.schedule,
                          dateLabel: nextDate.dateLabel,
                          dayLabel: nextDate.dayLabel,
                        },
                      })
                    }}
                    type="date"
                    value={formatSessionDateForInput(normalizedSession.schedule.dateLabel)}
                  />
                </FormField>

                <FormField error={errors.startTime} label="Start Time">
                  <IconInput
                    hasError={Boolean(errors.startTime)}
                    icon={LuClock3}
                    inputClassName="appearance-none"
                    onChange={(event) => updateSchedule('startTime', formatTimeForDisplay(event.target.value))}
                    type="time"
                    value={formatTimeForInput(normalizedSession.schedule.startTime)}
                  />
                </FormField>

                <FormField error={errors.endTime} label="End Time">
                  <IconInput
                    hasError={Boolean(errors.endTime)}
                    icon={LuClock3}
                    inputClassName="appearance-none"
                    onChange={(event) => updateSchedule('endTime', formatTimeForDisplay(event.target.value))}
                    type="time"
                    value={formatTimeForInput(normalizedSession.schedule.endTime)}
                  />
                </FormField>
              </div>

              <FormField error={errors.sessionType} label="Type">
                <div className="space-y-3">
                  <TypePicker
                    customSessionType={normalizedSession.customSessionType}
                    hasError={Boolean(errors.sessionType)}
                    onSelect={handleTypeChange}
                    sessionType={normalizedSession.sessionType}
                  />
                  {normalizedSession.sessionType === 'custom' ? (
                    <TextInput
                      hasError={Boolean(errors.customSessionType)}
                      onChange={(event) => updateField('customSessionType', event.target.value)}
                      placeholder="Type a new session category"
                      value={normalizedSession.customSessionType ?? ''}
                    />
                  ) : null}
                </div>
              </FormField>
            </div>
            {errors.customSessionType && normalizedSession.sessionType === 'custom' ? (
              <p className="text-sm text-error">{errors.customSessionType}</p>
            ) : null}
          </div>
        </SectionCard>

        <div className="border-t border-divider/70" />

        <SectionCard framed={false} title="Session Details">
          <div className="grid gap-4">
            <FormField error={errors.title} label="Session Title">
              <TextInput
                hasError={Boolean(errors.title)}
                onChange={(event) => updateField('title', event.target.value)}
                placeholder="Enter session title"
                value={normalizedSession.title}
              />
            </FormField>

            <FormField error={errors.description} label="Description">
              <Textarea
                hasError={Boolean(errors.description)}
                onChange={(event) => updateField('description', event.target.value)}
                placeholder="Write a short session description"
                value={normalizedSession.description ?? ''}
              />
            </FormField>
          </div>
        </SectionCard>

        <div className="border-t border-divider/70" />

        <SectionCard framed={false} title="Resources">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="font-label text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                Resource Links
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  className="inline-flex items-center gap-2 rounded-full border border-divider px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-heading transition hover:border-primary/30 hover:text-primary"
                  onClick={() => updateSession(addAction(normalizedSession, 'slides', ''))}
                  type="button"
                >
                  <LuPlus aria-hidden="true" className="h-3.5 w-3.5" />
                  <span>Slides</span>
                </button>
                <button
                  className="inline-flex items-center gap-2 rounded-full border border-divider px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-heading transition hover:border-primary/30 hover:text-primary"
                  onClick={() => updateSession(addAction(normalizedSession, 'startCodelab', ''))}
                  type="button"
                >
                  <LuPlus aria-hidden="true" className="h-3.5 w-3.5" />
                  <span>Codelab</span>
                </button>
              </div>
            </div>

            {(normalizedSession.actions ?? []).length ? (
              <div className="space-y-3">
                {(normalizedSession.actions ?? []).map((action) => (
                  <ResourceRow
                    error={errors[`resource:${action.id}`]}
                    href={action.href ?? ''}
                    key={action.id}
                    kind={action.labelKey === 'slides' ? 'Slides' : action.labelKey === 'startCodelab' ? 'Codelab' : action.labelKey}
                    onChange={(event) => updateResource(action.id, event.target.value)}
                    onRemove={() => updateSession(removeActionById(normalizedSession, action.id))}
                  />
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted">No resources added yet.</p>
            )}
          </div>
        </SectionCard>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-divider/70 pt-5">
        <div className="flex gap-2">
          {onDelete ? (
            <button
              className="inline-flex items-center gap-2 rounded-full border border-error/20 bg-error-bg px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-error transition hover:border-error/40"
              disabled={deleteDisabled}
              onClick={onDelete}
              title={deleteDisabled ? deleteTooltip : undefined}
              type="button"
            >
              <LuTrash2 aria-hidden="true" className="h-3.5 w-3.5" />
              <span>Delete</span>
            </button>
          ) : null}
        </div>

        <div className="flex gap-2">
          {onCancel ? (
            <button
              className="rounded-full border border-divider px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-heading transition hover:border-primary/30 hover:text-primary"
              onClick={onCancel}
              type="button"
            >
              Cancel
            </button>
          ) : null}
          <button
            className="rounded-full bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-card transition hover:brightness-95"
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
