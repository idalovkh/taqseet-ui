/**
 * Textarea Component
 * Reusable textarea with label and error handling
 */

import React, { forwardRef } from 'react'
import { Tooltip } from '@/shared/components/ui/Tooltip'
import './Textarea.css'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  /** Подсказка при наведении на иконку i рядом с label */
  labelTooltip?: string
  error?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, labelTooltip, error, className = '', ...props },
  ref
) {
  return (
    <div className={`textarea-wrapper ${className}`}>
      {label && (
        <label className={`textarea-label ${labelTooltip ? 'textarea-label--with-tooltip' : ''}`}>
          {label}
          {labelTooltip && (
            <Tooltip content={labelTooltip} placement="top">
              <span className="tooltip-trigger" aria-hidden="true">
                i
              </span>
            </Tooltip>
          )}
        </label>
      )}
      <textarea
        ref={ref}
        className={`textarea ${error ? 'textarea--error' : ''}`}
        {...props}
      />
      {error && <span className="textarea-error">{error}</span>}
    </div>
  )
})
