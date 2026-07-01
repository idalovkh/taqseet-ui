import type { ReactNode } from 'react'
import './SegmentedControl.css'

export interface SegmentedControlOption {
  id: string
  label: string
  /** Полная подпись для aria-label / title при коротком label */
  ariaLabel?: string
  icon?: ReactNode
}

interface SegmentedControlProps {
  options: SegmentedControlOption[]
  value: string
  onChange: (id: string) => void
  className?: string
  ariaLabel?: string
  iconOnly?: boolean
}

export function SegmentedControl({
  options,
  value,
  onChange,
  className = '',
  ariaLabel,
  iconOnly = false,
}: SegmentedControlProps) {
  return (
    <div
      className={`segmented-control ${className}`.trim()}
      role="tablist"
      aria-label={ariaLabel}
    >
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          role="tab"
          aria-selected={value === option.id}
          aria-label={option.ariaLabel ?? option.label}
          title={option.ariaLabel ?? option.label}
          className={`segmented-control__option${value === option.id ? ' segmented-control__option--active' : ''}${
            iconOnly ? ' segmented-control__option--icon-only' : ''
          }`}
          onClick={() => onChange(option.id)}
        >
          {option.icon ? (
            <span className="segmented-control__icon" aria-hidden="true">
              {option.icon}
            </span>
          ) : null}
          {!iconOnly ? <span>{option.label}</span> : null}
        </button>
      ))}
    </div>
  )
}
