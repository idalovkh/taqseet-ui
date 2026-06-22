import { InputHTMLAttributes, forwardRef, useId } from 'react'
import { Tooltip } from '@/shared/components/ui/Tooltip'
import './Input.css'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  /** Подсказка при наведении на иконку i рядом с label */
  labelTooltip?: string
  error?: string
  warning?: string
  helperText?: string
}

/**
 * Input component with unique id generation strategy:
 * - If id is provided, use it (allows explicit control)
 * - If name is provided and label exists, generate unique id using useId()
 * - If no label, id is optional (no need for htmlFor association)
 * 
 * This ensures:
 * - No duplicate ids across the page
 * - Stable ids per component instance (useId is stable per render)
 * - name remains unchanged for form submission
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, labelTooltip, error, warning, helperText, className = '', id, name, ...props }, ref) => {
    // Generate unique id using React useId() when label exists
    const generatedId = useId()
    // Use provided id, or generate unique id if label exists
    const inputId = id || (label ? `${name || 'input'}-${generatedId}` : undefined)

    return (
      <div className={`input-wrapper ${className}`}>
        {label && inputId && (
          <label htmlFor={inputId} className={`input-label ${labelTooltip ? 'input-label--with-tooltip' : ''}`}>
            {label}
            {labelTooltip && (
              <Tooltip content={labelTooltip} placement="top">
                <span className="tooltip-trigger" aria-hidden="true">i</span>
              </Tooltip>
            )}
          </label>
        )}
        {label && !inputId && (
          <span className={`input-label ${labelTooltip ? 'input-label--with-tooltip' : ''}`}>
            {label}
            {labelTooltip && (
              <Tooltip content={labelTooltip} placement="top">
                <span className="tooltip-trigger" aria-hidden="true">i</span>
              </Tooltip>
            )}
          </span>
        )}
        <input
          ref={ref}
          id={inputId}
          name={name}
          className={`input ${error ? 'input-error' : ''} ${warning && !error ? 'input-warning' : ''}`}
          {...props}
        />
        {error && <span className="input-error-message">{error}</span>}
        {warning && !error && <span className="input-warning-message">{warning}</span>}
        {helperText && !error && !warning && (
          <span className="input-helper-text">{helperText}</span>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

