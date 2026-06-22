import React from 'react'
import { Badge, type BadgeVariant } from '../Badge'
import { getStatusDisplay } from './statusConfig'

interface StatusBadgeProps {
  status: string
  label?: string
  variant?: BadgeVariant
  strikethrough?: boolean
  className?: string
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  label,
  variant,
  strikethrough,
  className = '',
}) => {
  const display = getStatusDisplay(status)

  return (
    <Badge
      variant={variant ?? display.variant}
      shape="pill"
      strikethrough={strikethrough ?? display.strikethrough}
      className={className}
    >
      {label ?? display.label}
    </Badge>
  )
}
