import type { ReactNode } from 'react'
import { Button } from '../Button/Button'

export interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  actionLabel?: string
  onAction?: () => void
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="empty-state">
      {icon ? <div className="empty-state-icon">{icon}</div> : null}
      <h3 className="empty-state-title">{title}</h3>
      {description ? <p className="empty-state-description">{description}</p> : null}
      {actionLabel && onAction ? <Button onClick={onAction}>{actionLabel}</Button> : null}
    </div>
  )
}
