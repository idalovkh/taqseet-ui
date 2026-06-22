import { useId } from 'react'
import './GenderSelect.css'

export type GenderValue = 'male' | 'female'

const GENDER_OPTIONS: { value: GenderValue; label: string; ariaLabel: string }[] = [
  { value: 'male', label: 'М', ariaLabel: 'Мужской' },
  { value: 'female', label: 'Ж', ariaLabel: 'Женский' },
]

export interface GenderSelectProps {
  value: GenderValue
  onChange: (value: GenderValue) => void
  label?: string
  disabled?: boolean
  error?: string
  className?: string
  /** Компактная ширина для строки с датой/телефоном (32px высота) */
  compact?: boolean
}

export function GenderSelect({
  value,
  onChange,
  label = 'Пол',
  disabled = false,
  error,
  className = '',
  compact = true,
}: GenderSelectProps) {
  const groupId = useId()
  const errorId = error ? `${groupId}-error` : undefined

  return (
    <div
      className={[
        'gender-select',
        compact ? 'gender-select--compact' : '',
        error ? 'gender-select--error' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {label ? (
        <span className="gender-select__label" id={groupId}>
          {label}
        </span>
      ) : null}

      <div
        className="gender-select__control"
        role="radiogroup"
        aria-labelledby={label ? groupId : undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={errorId}
      >
        {GENDER_OPTIONS.map((option) => {
          const isActive = value === option.value
          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={isActive}
              aria-label={option.ariaLabel}
              title={option.ariaLabel}
              disabled={disabled}
              className={`gender-select__option${isActive ? ' gender-select__option--active' : ''}`}
              onClick={() => onChange(option.value)}
            >
              {option.label}
            </button>
          )
        })}
      </div>

      {error ? (
        <span className="gender-select__error" id={errorId} role="alert">
          {error}
        </span>
      ) : null}
    </div>
  )
}
