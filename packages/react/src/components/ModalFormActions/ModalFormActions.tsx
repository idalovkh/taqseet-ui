import type { CSSProperties, ReactNode } from 'react'
import './ModalFormActions.css'

interface ModalFormActionsProps {
  children: ReactNode
  className?: string
  style?: CSSProperties
}

export function ModalFormActions({ children, className = '', style }: ModalFormActionsProps) {
  return (
    <div className={`modal-form-actions ${className}`.trim()} style={style}>
      {children}
    </div>
  )
}

