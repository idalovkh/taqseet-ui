import './SegmentedControl.css'

export interface SegmentedControlOption {
  id: string
  label: string
  /** Полная подпись для aria-label / title при коротком label */
  ariaLabel?: string
}

interface SegmentedControlProps {
  options: SegmentedControlOption[]
  value: string
  onChange: (id: string) => void
  className?: string
  ariaLabel?: string
}

export function SegmentedControl({
  options,
  value,
  onChange,
  className = '',
  ariaLabel,
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
          className={`segmented-control__option${value === option.id ? ' segmented-control__option--active' : ''}`}
          onClick={() => onChange(option.id)}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
