import React from 'react'
import './Badge.css'

export type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info'
export type BadgeShape = 'default' | 'pill'

interface BadgeProps {
  children: React.ReactNode
  variant?: BadgeVariant
  shape?: BadgeShape
  strikethrough?: boolean
  className?: string
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  shape = 'default',
  strikethrough = false,
  className = '',
}) => {
  return (
    <span
      className={[
        'badge',
        `badge-${variant}`,
        shape === 'pill' ? 'badge-pill' : '',
        strikethrough ? 'badge-strikethrough' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </span>
  )
}
