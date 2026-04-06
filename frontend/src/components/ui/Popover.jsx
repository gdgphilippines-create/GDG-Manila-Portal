import { cloneElement, isValidElement, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

export default function Popover({
  trigger,
  children,
  align = 'right',
  offset = 8,
  className = '',
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [position, setPosition] = useState({ left: 0, ready: false, top: 0 })
  const rootRef = useRef(null)
  const panelRef = useRef(null)

  useEffect(() => {
    if (!isOpen) {
      return undefined
    }

    function handlePointerDown(event) {
      const clickedInsideTrigger = rootRef.current?.contains(event.target)
      const clickedInsidePanel = panelRef.current?.contains(event.target)

      if (!clickedInsideTrigger && !clickedInsidePanel) {
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

  useEffect(() => {
    if (!isOpen) {
      return undefined
    }

    function updatePosition() {
      const rootElement = rootRef.current
      const panelElement = panelRef.current

      if (!rootElement || !panelElement) {
        return
      }

      const margin = 8
      const rootRect = rootElement.getBoundingClientRect()
      const panelRect = panelElement.getBoundingClientRect()
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight

      let nextLeft = align === 'left'
        ? rootRect.left
        : rootRect.right - panelRect.width

      nextLeft = Math.min(
        Math.max(nextLeft, margin),
        Math.max(margin, viewportWidth - panelRect.width - margin),
      )

      let nextTop = rootRect.bottom + offset

      if (nextTop + panelRect.height > viewportHeight - margin) {
        nextTop = Math.max(margin, rootRect.top - panelRect.height - offset)
      }

      setPosition({
        left: nextLeft,
        ready: true,
        top: nextTop,
      })
    }

    const frameId = window.requestAnimationFrame(updatePosition)
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)

    return () => {
      window.cancelAnimationFrame(frameId)
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [align, isOpen, offset])

  if (!isValidElement(trigger)) {
    throw new Error('Popover requires a valid React element as the trigger prop.')
  }

  function close() {
    setPosition((currentPosition) => ({ ...currentPosition, ready: false }))
    setIsOpen(false)
  }

  function toggle() {
    setPosition((currentPosition) => ({ ...currentPosition, ready: false }))
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

  const resolvedChildren = typeof children === 'function' ? children({ close }) : children

  return (
    <div ref={rootRef} className="relative inline-block">
      {triggerElement}
      {isOpen ? (
        createPortal(
          <div
            ref={panelRef}
            className={`surface-dialog fixed z-50 min-w-56 rounded-dialog border border-divider bg-card p-4 shadow-dropdown ${className}`.trim()}
            style={{
              left: `${position.left}px`,
              top: `${position.top}px`,
              visibility: position.ready ? 'visible' : 'hidden',
            }}
          >
            {resolvedChildren}
          </div>,
          document.body,
        )
      ) : null}
    </div>
  )
}
