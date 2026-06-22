import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import './ListFilter.css'

export type ListFilterOption<T extends string = string> = {
  value: T
  label: string
}

export interface ListFilterDropdownProps<T extends string = string> {
  value: T
  onChange: (value: T) => void
  options: readonly ListFilterOption<T>[]
  /** Prefix on trigger, e.g. "Статус: " */
  triggerPrefix?: string
  ariaLabel: string
  /** Компактный триггер для панелей фильтров (дашборд, отчёты) */
  compact?: boolean
}

export function ListFilterDropdown<T extends string = string>({
  value,
  onChange,
  options,
  triggerPrefix = '',
  ariaLabel,
  compact = false,
}: ListFilterDropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false)
  const [triggerMinWidth, setTriggerMinWidth] = useState<number | undefined>(undefined)
  const measureRef = useRef<HTMLSpanElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const [panelStyle, setPanelStyle] = useState<React.CSSProperties>({})

  const longestLabel =
    triggerPrefix +
    options.reduce((a, o) => (o.label.length > a.length ? o.label : a), '')

  useEffect(() => {
    if (compact || !measureRef.current) return
    const w = measureRef.current.getBoundingClientRect().width
    setTriggerMinWidth(Math.ceil(w) + 8 + 12 + 14 + 14)
  }, [compact, longestLabel])

  useEffect(() => {
    if (!isOpen || !wrapperRef.current) return
    const triggerRect = wrapperRef.current.getBoundingClientRect()
    setPanelStyle({
      position: 'fixed',
      left: `${triggerRect.left}px`,
      top: `${triggerRect.bottom + 4}px`,
      width: `${triggerRect.width}px`,
      zIndex: 10000,
    })
  }, [isOpen])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node
      if (wrapperRef.current?.contains(target) || panelRef.current?.contains(target)) return
      setIsOpen(false)
    }
    if (isOpen) document.addEventListener('mousedown', handleClickOutside, true)
    return () => document.removeEventListener('mousedown', handleClickOutside, true)
  }, [isOpen])

  const valueLabel = options.find((o) => o.value === value)?.label ?? options[0]?.label ?? ''
  const triggerLabel = triggerPrefix ? `${triggerPrefix}${valueLabel}` : valueLabel

  return (
    <div
      className={`list-filter-dropdown${compact ? ' list-filter-dropdown--toolbar-compact' : ''}`}
      ref={wrapperRef}
    >
      <span
        ref={measureRef}
        className="list-filter-dropdown-trigger-label"
        style={{
          position: 'absolute',
          visibility: 'hidden',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          fontSize: 14,
          fontWeight: 500,
        }}
        aria-hidden
      >
        {longestLabel}
      </span>
      <button
        type="button"
        className={`list-filter-dropdown-trigger${compact ? ' list-filter-dropdown-trigger--compact' : ''}`}
        style={!compact && triggerMinWidth !== undefined ? { minWidth: triggerMinWidth } : undefined}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={ariaLabel}
      >
        <span className="list-filter-dropdown-trigger-label">{triggerLabel}</span>
        <span className="list-filter-dropdown-trigger-icon" aria-hidden>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M3 4.5L6 7.5L9 4.5" />
          </svg>
        </span>
      </button>
      {isOpen &&
        createPortal(
          <div
            ref={panelRef}
            className="list-filter-dropdown-panel"
            style={panelStyle}
            role="listbox"
            aria-label={ariaLabel}
          >
            <div className="list-filter-dropdown-options">
              {options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={value === option.value}
                  className={`list-filter-dropdown-option ${value === option.value ? 'selected' : ''}`}
                  onClick={() => {
                    onChange(option.value)
                    setIsOpen(false)
                  }}
                >
                  <span className="list-filter-dropdown-option-label">{option.label}</span>
                  {value === option.value ? (
                    <span className="list-filter-dropdown-option-check" aria-hidden>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M13 4L6 11L3 8" />
                      </svg>
                    </span>
                  ) : null}
                </button>
              ))}
            </div>
          </div>,
          document.body
        )}
    </div>
  )
}
