import { useState, useRef, useEffect, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { SlidersHorizontal } from 'lucide-react'
import './ListFilter.css'

export type FilterOption<T extends string = string> = {
  value: T
  label: string
}

export type FilterGroupConfig<T extends string = string> = {
  key: string
  title: string
  value: T
  onChange: (value: T) => void
  options: readonly FilterOption<T>[]
  /** «Без фильтра» для счётчика на compact-кнопке */
  emptyValue?: T
}

interface ListFiltersCombinedProps {
  groups: FilterGroupConfig<string>[]
  ariaLabel?: string
  /** Компактная иконка (рядом с поиском на mobile/tablet) */
  compact?: boolean
}

function countActiveFilters(groups: FilterGroupConfig<string>[]): number {
  return groups.filter((g) => {
    const empty = g.emptyValue ?? 'all'
    return g.value !== empty && g.value !== ''
  }).length
}

const PANEL_WIDTH = 280

export function ListFiltersCombined({
  groups,
  ariaLabel = 'Фильтры',
  compact = false,
}: ListFiltersCombinedProps) {
  const [isOpen, setIsOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const [panelStyle, setPanelStyle] = useState<React.CSSProperties>({})

  const activeCount = useMemo(() => countActiveFilters(groups), [groups])
  const triggerLabel = activeCount > 0 ? `Фильтры · ${activeCount}` : 'Фильтры'

  useEffect(() => {
    if (!isOpen || !wrapperRef.current) return

    const triggerRect = wrapperRef.current.getBoundingClientRect()
    const panelWidth = Math.max(triggerRect.width, PANEL_WIDTH)
    const left = compact
      ? Math.max(8, triggerRect.right - panelWidth)
      : triggerRect.left

    setPanelStyle({
      position: 'fixed',
      left: `${left}px`,
      top: `${triggerRect.bottom + 4}px`,
      width: `${panelWidth}px`,
      zIndex: 10000,
    })
  }, [isOpen, compact])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node
      if (wrapperRef.current?.contains(target) || panelRef.current?.contains(target)) return
      setIsOpen(false)
    }
    if (isOpen) document.addEventListener('mousedown', handleClickOutside, true)
    return () => document.removeEventListener('mousedown', handleClickOutside, true)
  }, [isOpen])

  const wrapperClass = [
    'list-filter-dropdown',
    'list-filter-dropdown--combined',
    compact ? 'list-filter-dropdown--compact' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={wrapperClass} ref={wrapperRef}>
      <button
        type="button"
        className="list-filter-dropdown-trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-label={activeCount > 0 ? `${ariaLabel}, выбрано: ${activeCount}` : ariaLabel}
      >
        {compact ? (
          <>
            <SlidersHorizontal size={20} strokeWidth={2} aria-hidden />
            {activeCount > 0 ? (
              <span className="list-filter-dropdown-badge" aria-hidden>
                {activeCount}
              </span>
            ) : null}
          </>
        ) : (
          <>
            <span className="list-filter-dropdown-trigger-label">{triggerLabel}</span>
            <span className="list-filter-dropdown-trigger-icon" aria-hidden>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M3 4.5L6 7.5L9 4.5" />
              </svg>
            </span>
          </>
        )}
      </button>
      {isOpen &&
        createPortal(
          <div
            ref={panelRef}
            className="list-filter-dropdown-panel list-filter-dropdown-panel--combined"
            style={panelStyle}
            role="dialog"
            aria-label={ariaLabel}
          >
            {groups.map((group, index) => (
              <div
                key={group.key}
                className={`list-filter-dropdown-group${index > 0 ? ' list-filter-dropdown-group--bordered' : ''}`}
              >
                <p className="list-filter-dropdown-group-title">{group.title}</p>
                <div className="list-filter-dropdown-options" role="listbox" aria-label={group.title}>
                  {group.options.map((option) => (
                    <button
                      key={`${group.key}-${option.value}`}
                      type="button"
                      role="option"
                      aria-selected={group.value === option.value}
                      className={`list-filter-dropdown-option ${group.value === option.value ? 'selected' : ''}`}
                      onClick={() => group.onChange(option.value)}
                    >
                      <span className="list-filter-dropdown-option-label">{option.label}</span>
                      {group.value === option.value ? (
                        <span className="list-filter-dropdown-option-check" aria-hidden>
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M13 4L6 11L3 8" />
                          </svg>
                        </span>
                      ) : null}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>,
          document.body
        )}
    </div>
  )
}
