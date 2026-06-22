import {
  useCallback,
  useEffect,
  useId,
  useRef,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'
import { DismissButton } from '@/shared/components/ui/CircleIconButton'
import './BottomSheet.css'

const SWIPE_DISMISS_THRESHOLD = 80

export interface BottomSheetProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
  portalContainer?: HTMLElement | null
  /** When portaled inside a modal — skip body scroll lock */
  nested?: boolean
  overlayZIndex?: number
  onOpened?: () => void
}

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(
    container.querySelectorAll<HTMLElement>(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
  )
}

export function BottomSheet({
  isOpen,
  onClose,
  title,
  children,
  portalContainer,
  nested = false,
  overlayZIndex,
  onOpened,
}: BottomSheetProps) {
  const titleId = useId()
  const sheetRef = useRef<HTMLDivElement | null>(null)
  const dragStartYRef = useRef<number | null>(null)
  const dragOffsetRef = useRef(0)

  useEffect(() => {
    if (!isOpen || nested) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [isOpen, nested])

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  useEffect(() => {
    if (!isOpen || !sheetRef.current) return

    const container = sheetRef.current
    const focusable = getFocusableElements(container)
    const first = focusable[0]
    const last = focusable[focusable.length - 1]

    onOpened?.()
    first?.focus()

    const handleTab = (event: KeyboardEvent) => {
      if (event.key !== 'Tab' || focusable.length === 0) return

      if (event.shiftKey) {
        if (document.activeElement === first) {
          event.preventDefault()
          last?.focus()
        }
        return
      }

      if (document.activeElement === last) {
        event.preventDefault()
        first?.focus()
      }
    }

    document.addEventListener('keydown', handleTab)
    return () => document.removeEventListener('keydown', handleTab)
  }, [isOpen, onOpened])

  const resetDrag = useCallback(() => {
    dragStartYRef.current = null
    dragOffsetRef.current = 0
    if (sheetRef.current) {
      sheetRef.current.style.transform = ''
      sheetRef.current.style.transition = ''
    }
  }, [])

  const handlePointerDown = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    dragStartYRef.current = event.clientY
    dragOffsetRef.current = 0
    event.currentTarget.setPointerCapture(event.pointerId)
  }, [])

  const handlePointerMove = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    if (dragStartYRef.current === null || !sheetRef.current) return
    const offset = Math.max(0, event.clientY - dragStartYRef.current)
    dragOffsetRef.current = offset
    sheetRef.current.style.transition = 'none'
    sheetRef.current.style.transform = `translateY(${offset}px)`
  }, [])

  const handlePointerUp = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (dragStartYRef.current === null) return

      if (dragOffsetRef.current >= SWIPE_DISMISS_THRESHOLD) {
        onClose()
      } else if (sheetRef.current) {
        sheetRef.current.style.transition = 'transform 0.2s ease-out'
        sheetRef.current.style.transform = 'translateY(0)'
      }

      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId)
      }

      window.setTimeout(resetDrag, 200)
    },
    [onClose, resetDrag]
  )

  if (!isOpen) return null

  const target = portalContainer ?? document.body

  return createPortal(
    <div
      className={`bottom-sheet-overlay${nested ? ' bottom-sheet-overlay--nested' : ''}`}
      style={overlayZIndex != null ? { zIndex: overlayZIndex } : undefined}
      onClick={onClose}
    >
      <div
        ref={sheetRef}
        className="bottom-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(event) => event.stopPropagation()}
      >
        <div
          className="bottom-sheet__handle-row"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={resetDrag}
        >
          <span className="bottom-sheet__handle" aria-hidden="true" />
        </div>

        <div className="bottom-sheet__header">
          <h2 id={titleId} className="bottom-sheet__title">
            {title}
          </h2>
          <DismissButton size="md" onClick={onClose} />
        </div>

        <div className="bottom-sheet__body">{children}</div>
      </div>
    </div>,
    target
  )
}
