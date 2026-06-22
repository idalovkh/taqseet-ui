import { useState, InputHTMLAttributes, forwardRef, useId } from 'react'
import './PasswordInput.css'

interface PasswordInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
  error?: string
  helperText?: string
}

/**
 * PasswordInput component with unique id generation strategy:
 * - If id is provided, use it (allows explicit control)
 * - If name is provided and label exists, generate unique id using useId()
 * - If no label, id is optional (no need for htmlFor association)
 * 
 * This ensures:
 * - No duplicate ids across the page
 * - Stable ids per component instance (useId is stable per render)
 * - name remains unchanged for form submission
 */
export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ label, error, helperText, className = '', id, name, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false)
    // Generate unique id using React useId() when label exists
    const generatedId = useId()
    // Use provided id, or generate unique id if label exists
    const inputId = id || (label ? `password-input-${name || 'field'}-${generatedId}` : undefined)

    const togglePasswordVisibility = () => {
      setShowPassword((prev) => !prev)
    }

    return (
      <div className={`input-wrapper password-input-wrapper ${className}`}>
        {label && inputId && (
          <label htmlFor={inputId} className="input-label">
            {label}
          </label>
        )}
        {label && !inputId && (
          <span className="input-label">
            {label}
          </span>
        )}
        <div className="password-input-container">
          <input
            ref={ref}
            id={inputId}
            name={name}
            type={showPassword ? 'text' : 'password'}
            className={`input password-input ${error ? 'input-error' : ''}`}
            {...props}
          />
          <button
            type="button"
            className="password-toggle"
            onClick={togglePasswordVisibility}
            aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
            tabIndex={-1}
          >
            {showPassword ? (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            ) : (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        </div>
        {error && <span className="input-error-message">{error}</span>}
        {helperText && !error && (
          <span className="input-helper-text">{helperText}</span>
        )}
      </div>
    )
  }
)

PasswordInput.displayName = 'PasswordInput'
