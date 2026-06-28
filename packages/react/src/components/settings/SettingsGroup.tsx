import type { ReactNode } from 'react'

export interface SettingsGroupProps {
  children: ReactNode
  className?: string
}

export function SettingsGroup({ children, className = '' }: SettingsGroupProps) {
  return (
    <div className={`settings-group mobile-nav-group ${className}`.trim()}>{children}</div>
  )
}
