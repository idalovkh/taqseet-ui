import React, { useState, useRef, useEffect, useId } from 'react'
import { createPortal } from 'react-dom'
import {
  useFloating,
  offset,
  flip,
  shift,
  autoUpdate,
} from '@floating-ui/react-dom'
import './Tooltip.css'

const DELAY_MS = 300
const OFFSET_PX = 14
const SHIFT_PADDING = 12

export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right'
export type TooltipAlignment = 'start' | 'center' | 'end'

function toFloatingPlacement(
  placement: TooltipPlacement,
  alignment: TooltipAlignment
): `${TooltipPlacement}-start` | `${TooltipPlacement}-end` | TooltipPlacement {
  if (alignment === 'center') return placement
  return `${placement}-${alignment}` as `${TooltipPlacement}-start` | `${TooltipPlacement}-end`
}

interface TooltipProps {
  content: string
  children: React.ReactElement
  /** Где показывать тултип относительно триггера */
  placement?: TooltipPlacement
  /** Выравнивание по второй оси: start = по верху/слева, end = по низу/справа, center = по центру */
  alignment?: TooltipAlignment
  disabled?: boolean
  /** Дополнительный класс для контента тултипа (многострочный текст, отступы). */
  tooltipClassName?: string
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  placement = 'top',
  alignment = 'center',
  disabled = false,
  tooltipClassName,
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const portalRootRef = useRef<HTMLDivElement | null>(null)
  const tooltipId = useId()

  const floatingPlacement = toFloatingPlacement(placement, alignment)

  const { refs, floatingStyles, placement: resolvedPlacement } = useFloating({
    placement: floatingPlacement,
    strategy: 'fixed',
    open: isVisible,
    middleware: [
      offset(OFFSET_PX),
      flip({ padding: SHIFT_PADDING }),
      shift({ padding: SHIFT_PADDING }),
    ],
    whileElementsMounted: autoUpdate,
  })

  useEffect(() => {
    if (typeof document === 'undefined') return
    const el = document.createElement('div')
    el.setAttribute('data-tooltip-portal', '')
    document.body.appendChild(el)
    portalRootRef.current = el
    return () => {
      document.body.removeChild(el)
      portalRootRef.current = null
    }
  }, [])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  useEffect(() => {
    if (!isVisible) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsVisible(false)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [isVisible])

  const show = () => {
    if (disabled) return
    timeoutRef.current = setTimeout(() => setIsVisible(true), DELAY_MS)
  }

  const hide = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setIsVisible(false)
  }

  const portalRoot = portalRootRef.current
  const tooltipNode =
    isVisible && portalRoot ? (
      <div
        ref={refs.setFloating}
        id={tooltipId}
        className={[
          'tooltip',
          'tooltip-portal',
          `tooltip-${resolvedPlacement.split('-')[0]}`,
          tooltipClassName,
        ]
          .filter(Boolean)
          .join(' ')}
        style={floatingStyles}
        role="tooltip"
      >
        {content}
      </div>
    ) : null

  return (
    <div
      ref={refs.setReference}
      className="tooltip-wrapper"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
      tabIndex={disabled ? undefined : 0}
      aria-describedby={isVisible ? tooltipId : undefined}
    >
      {children}
      {portalRoot && createPortal(tooltipNode, portalRoot)}
    </div>
  )
}
