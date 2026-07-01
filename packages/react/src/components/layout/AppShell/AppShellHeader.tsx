import type { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import type { AppShellBrand, AppShellHeaderAction } from './AppShell.types'

interface AppShellHeaderProps {
  brand: AppShellBrand
  onMenuClick: () => void
  sidebarOpen: boolean
  showMenuButton?: boolean
  actions?: AppShellHeaderAction[]
  rightSlot?: ReactNode
  accountMenu?: ReactNode
}

export function AppShellHeader({
  brand,
  onMenuClick,
  sidebarOpen,
  showMenuButton = true,
  actions = [],
  rightSlot,
  accountMenu,
}: AppShellHeaderProps) {
  return (
    <header className={`app-header ${showMenuButton ? '' : 'app-header--menu-hidden'}`.trim()}>
      <div className="app-header-left">
        {showMenuButton ? (
          <button className="app-header-menu-button" onClick={onMenuClick} aria-label="Toggle menu">
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        ) : null}
        <button
          type="button"
          className="app-header-logo"
          onClick={brand.onClick}
          aria-label={brand.ariaLabel ?? brand.text}
        >
          {brand.icon ? <div className="app-header-logo-icon">{brand.icon}</div> : null}
          <span className="app-header-logo-text">{brand.text}</span>
        </button>
      </div>
      <div className="app-header-spacer" />
      <div className="app-header-right">
        {actions.map((action) => {
          if (action.to) {
            return (
              <NavLink
                key={action.key}
                to={action.to}
                className={({ isActive }) =>
                  `app-header-icon-button${isActive || action.active ? ' app-header-icon-button--active' : ''}`
                }
                aria-label={action.ariaLabel}
              >
                {action.icon}
              </NavLink>
            )
          }
          return (
            <button
              key={action.key}
              type="button"
              className={`app-header-icon-button${action.active ? ' app-header-icon-button--active' : ''}`}
              onClick={action.onClick}
              aria-label={action.ariaLabel}
            >
              {action.icon}
            </button>
          )
        })}
        {rightSlot}
        {accountMenu}
      </div>
    </header>
  )
}
