import type { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'

export interface SettingsNavItemProps {
  to: string
  label: string
  description?: string
  icon: ReactNode
  end?: boolean
  active?: boolean
  onPrefetch?: (to: string) => void
}

export function SettingsNavItem({
  to,
  label,
  description,
  icon,
  end = false,
  active = false,
  onPrefetch,
}: SettingsNavItemProps) {
  return (
    <NavLink
      to={to}
      end={end}
      className={`settings-nav-item${active ? ' settings-nav-item--active' : ''}`}
      aria-current={active ? 'page' : undefined}
      onMouseEnter={() => onPrefetch?.(to)}
      onFocus={() => onPrefetch?.(to)}
    >
      <span className="settings-nav-item__icon">{icon}</span>
      <span className="settings-nav-item__copy">
        <span className="settings-nav-item__label">{label}</span>
        {description ? <span className="settings-nav-item__description">{description}</span> : null}
      </span>
    </NavLink>
  )
}
