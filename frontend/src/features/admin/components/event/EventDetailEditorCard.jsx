import { GlassPanel, FormField, IconInput, SectionCard, TextInput, Textarea } from '@/components/ui'
import { LuCalendarDays, LuImage, LuMapPin } from 'react-icons/lu'
import { adminOverviewLabels } from '@/copy/admin'
import { surfacePatterns } from '@/styles/layout'

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

export default function EventDetailEditorCard({ draft, onChange, onSave }) {
  function updateField(field, value) {
    onChange((currentDraft) => ({ ...currentDraft, [field]: value }))
  }

  return (
    <GlassPanel variant="card">
      <div className={surfacePatterns.panelBodyClassName}>
        <div className="mb-6">
          <h2 className="text-[20px] font-semibold leading-7 text-heading">
            {adminOverviewLabels.eventDetailTitle}
          </h2>
        </div>

        <div className="space-y-6">
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(18rem,0.9fr)]">
            <div className="grid gap-6">
              <FormField label="Headline">
                <TextInput
                  onChange={(event) => updateField('title', event.target.value)}
                  value={draft.title}
                />
              </FormField>

              <FormField label="Description">
                <Textarea
                  className="min-h-40"
                  onChange={(event) => updateField('description', event.target.value)}
                  value={draft.description}
                />
              </FormField>
            </div>

            <SectionCard title="Display Details">
              <div className="grid gap-4">
                <FormField label="Header Image">
                  <IconInput
                    icon={LuImage}
                    onChange={(event) => updateField('heroImageUrl', event.target.value)}
                    placeholder="Paste header image URL"
                    value={draft.heroImageUrl}
                  />
                </FormField>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-1">
                  <FormField label="Location">
                    <IconInput
                      icon={LuMapPin}
                      onChange={(event) => updateField('location', event.target.value)}
                      placeholder="Enter event location"
                      value={draft.location}
                    />
                  </FormField>

                  <FormField label="Date">
                    <IconInput
                      icon={LuCalendarDays}
                      inputClassName="appearance-none"
                      onChange={(event) => updateField('date', formatDateForDisplay(event.target.value))}
                      type="date"
                      value={formatDateForInput(draft.date)}
                    />
                  </FormField>
                </div>
              </div>
            </SectionCard>
          </div>
        </div>

        <div className="mt-6 flex justify-end border-t border-divider/70 pt-5">
          <button
            className="rounded-full bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-card transition hover:brightness-95"
            onClick={onSave}
            type="button"
          >
            Save
          </button>
        </div>
      </div>
    </GlassPanel>
  )
}
