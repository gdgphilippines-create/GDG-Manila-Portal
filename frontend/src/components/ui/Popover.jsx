import { cloneElement, isValidElement, useEffect, useRef, useState } from 'react'

export default function Popover({
  trigger,
  children,
  align = 'right',
  offset = 8,
  className = '',
}) {
  const [isOpen, setIsOpen] = useState(false)
  const rootRef = useRef(null)

  useEffect(() => {
    if (!isOpen) {
      return undefined
    }

    function handlePointerDown(event) {
      if (!rootRef.current?.contains(event.target)) {
        setIsOpen(false)
      }
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  if (!isValidElement(trigger)) {
    throw new Error('Popover requires a valid React element as the trigger prop.')
  }

  function close() {
    setIsOpen(false)
  }

  function toggle() {
    setIsOpen((currentValue) => !currentValue)
  }

  const triggerElement = cloneElement(trigger, {
    'aria-expanded': isOpen,
    'aria-haspopup': 'dialog',
    onClick: (event) => {
      trigger.props.onClick?.(event)

      if (!event.defaultPrevented) {
        toggle()
      }
    },
  })

  const alignmentClassName = align === 'left' ? 'left-0' : 'right-0'
  const resolvedChildren = typeof children === 'function' ? children({ close }) : children

  return (
    <div ref={rootRef} className="relative inline-block">
      {triggerElement}
      {isOpen ? (
        <div
          className={`surface-dialog absolute z-50 min-w-56 rounded-dialog border border-divider bg-card p-4 shadow-dropdown ${alignmentClassName} ${className}`.trim()}
          style={{ top: `calc(100% + ${offset}px)` }}
        >
          {resolvedChildren}
        </div>
      ) : null}
    </div>
  )
}
