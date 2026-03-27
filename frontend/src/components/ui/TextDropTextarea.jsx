import { useRef, useState } from 'react'
import Textarea from './Textarea'

function isSupportedTextFile(file) {
  return file.type.startsWith('text/')
    || /\.(md|txt|json|csv)$/i.test(file.name)
}

function normalizeHtmlToText(value) {
  const html = String(value || '').trim()

  if (!html) {
    return ''
  }

  if (typeof DOMParser === 'undefined') {
    return html
  }

  return new DOMParser().parseFromString(html, 'text/html').body.textContent?.trim() ?? ''
}

function readTransferItem(item) {
  return new Promise((resolve) => {
    item.getAsString((value) => resolve(String(value || '').trim()))
  })
}

async function getDroppedText(event) {
  const transfer = event.dataTransfer

  if (!transfer) {
    return ''
  }

  const plainText = String(transfer.getData('text/plain') || '').trim()

  if (plainText) {
    return plainText
  }

  const droppedUrl = String(transfer.getData('text/uri-list') || '')
    .split('\n')
    .map((value) => value.trim())
    .find((value) => value && !value.startsWith('#'))

  if (droppedUrl) {
    return droppedUrl
  }

  const items = Array.from(transfer.items ?? [])
  const stringItems = items.filter((item) => item.kind === 'string')
  const plainTextItem = stringItems.find((item) => item.type === 'text/plain')

  if (plainTextItem) {
    const itemText = await readTransferItem(plainTextItem)

    if (itemText) {
      return itemText
    }
  }

  const htmlItem = stringItems.find((item) => item.type === 'text/html')

  if (htmlItem) {
    const htmlText = normalizeHtmlToText(await readTransferItem(htmlItem))

    if (htmlText) {
      return htmlText
    }
  }

  const fallbackStringItem = stringItems.find((item) => item.type.startsWith('text/'))

  if (fallbackStringItem) {
    const fallbackText = await readTransferItem(fallbackStringItem)

    if (fallbackText) {
      return fallbackText
    }
  }

  const textFile = Array.from(transfer.files ?? []).find(isSupportedTextFile)

  if (!textFile) {
    return ''
  }

  return (await textFile.text()).trim()
}

function insertDroppedText(currentValue, droppedText, selectionStart, selectionEnd) {
  const insertionStart = Number.isInteger(selectionStart) ? selectionStart : currentValue.length
  const insertionEnd = Number.isInteger(selectionEnd) ? selectionEnd : insertionStart
  const needsLeadingBreak = insertionStart > 0 && !currentValue.slice(0, insertionStart).endsWith('\n')
  const needsTrailingBreak = insertionEnd < currentValue.length && !currentValue.slice(insertionEnd).startsWith('\n')
  const normalizedText = `${needsLeadingBreak ? '\n\n' : ''}${droppedText}${needsTrailingBreak ? '\n\n' : ''}`

  return {
    cursorPosition: insertionStart + normalizedText.length,
    value: `${currentValue.slice(0, insertionStart)}${normalizedText}${currentValue.slice(insertionEnd)}`,
  }
}

export default function TextDropTextarea({
  dropErrorMessage = 'Drop plain text, a URL, or a text file.',
  dropHint = 'Drop text, a URL, or a text file into the description.',
  hasError = false,
  onChange,
  onValueChange,
  textareaClassName = '',
  value = '',
  ...props
}) {
  const textareaRef = useRef(null)
  const [dropError, setDropError] = useState('')
  const [isDropActive, setIsDropActive] = useState(false)

  function handleChange(event) {
    onChange?.(event)
    onValueChange?.(event.target.value)
  }

  function handleDragEnter(event) {
    event.preventDefault()
    setDropError('')
    setIsDropActive(true)
  }

  function handleDragLeave(event) {
    if (event.currentTarget.contains(event.relatedTarget ?? null)) {
      return
    }

    setIsDropActive(false)
  }

  async function handleDrop(event) {
    event.preventDefault()
    setDropError('')
    setIsDropActive(false)

    const droppedText = await getDroppedText(event)

    if (!droppedText) {
      setDropError(dropErrorMessage)
      return
    }

    const textarea = textareaRef.current
    const { value: nextValue, cursorPosition } = insertDroppedText(
      String(value ?? ''),
      droppedText,
      textarea?.selectionStart,
      textarea?.selectionEnd,
    )

    onValueChange?.(nextValue)

    requestAnimationFrame(() => {
      if (!textareaRef.current) {
        return
      }

      textareaRef.current.focus()
      textareaRef.current.setSelectionRange(cursorPosition, cursorPosition)
    })
  }

  return (
    <>
      <div
        className={`rounded-dialog border border-dashed p-2 transition ${
          isDropActive
            ? 'border-primary/50 bg-primary/5'
            : 'border-divider/80 bg-footer/40'
        }`.trim()}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragEnter}
        onDrop={handleDrop}
      >
        <Textarea
          {...props}
          className={textareaClassName}
          hasError={hasError || Boolean(dropError)}
          onChange={handleChange}
          ref={textareaRef}
          value={value}
        />
        {dropHint ? (
          <p className="mt-2 px-1 text-xs text-muted">{dropHint}</p>
        ) : null}
      </div>
      {dropError ? <p className="mt-2 text-sm text-error">{dropError}</p> : null}
    </>
  )
}
