/**
 * Select Component
 * Reusable select dropdown with label and error handling
 */

import React from 'react'
import '../Input/Input.css'
import './Select.css'

export interface SelectOption {
  value: string
  label: string
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: SelectOption[]
}

export const Select: React.FC<SelectProps> = ({
  label,
  error,
  options,
  className = '',
  ...props
}) => {
  return (
    <div className={`input-wrapper select-wrapper ${className}`}>
      {label && <label className="input-label select-label">{label}</label>}
      <select className={`input select ${error ? 'input-error select--error' : ''}`} {...props}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <span className="input-error-message select-error">{error}</span>}
    </div>
  )
}

