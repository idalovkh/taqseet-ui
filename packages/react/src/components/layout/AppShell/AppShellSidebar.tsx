import { useCallback, useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { ChevronDown, ChevronRight, PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import type { AppShellNavItem } from './AppShell.types'

interface AppShellSidebarProps {
  navItems: AppShellNavItem[]
  isOpen: boolean
  onClose: () => void
  isMobile?: boolean
  isCollapsed?: boolean
  onExpand?: () => void
  onToggle?: () => void
  onPrefetchPath?: (path: string) => void
}

export function AppShellSidebar({
  navItems,
  isOpen,
  onClose,
  isMobile = false,
  isCollapsed = false,
  onExpand,
  onToggle,
  onPrefetchPath,
}: AppShellSidebarProps) {
  const location = useLocation()
  const [openSubmenus, setOpenSubmenus] = useState<string[]>([])

  const handleLinkClick = useCallback(() => {
    if (isMobile) onClose()
  }, [isMobile, onClose])

  const toggleSubmenu = useCallback(
    (label: string) => {
      if (isCollapsed && onExpand) {
        onExpand()
        setOpenSubmenus([label])
        return
      }
      setOpenSubmenus((prev) =>
        prev.includes(label) ? prev.filter((item) => item !== label) : [...prev, label],
      )
    },
    [isCollapsed, onExpand],
  )

  useEffect(() => {
    if (isCollapsed) setOpenSubmenus([])
  }, [isCollapsed])

  const isSubmenuActive = (item: AppShellNavItem): boolean => {
    if (!item.children?.length) return false
    return item.children.some((sub) => location.pathname.startsWith(sub.path))
  }

  const isItemActive = (item: AppShellNavItem): boolean => {
    if (item.isActive) return item.isActive(location.pathname)
    if (item.path) return location.pathname === item.path
    return isSubmenuActive(item)
  }

  return (
    <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''} ${isCollapsed ? 'sidebar-collapsed' : ''}`}>
      {onToggle ? (
        <div className="sidebar-control">
          <button
            type="button"
            className="sidebar-toggle-button"
            onClick={onToggle}
            aria-label={isCollapsed ? 'Развернуть меню' : 'Свернуть меню'}
            title={isCollapsed ? 'Развернуть меню' : 'Свернуть меню'}
          >
            {isCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
          </button>
        </div>
      ) : null}
      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const key = item.key ?? item.path ?? item.label
          const hasSubmenu = Boolean(item.children?.length)
          const submenuOpen = openSubmenus.includes(item.label) || isSubmenuActive(item)
          const itemTitle = isCollapsed ? item.label : undefined

          if (hasSubmenu) {
            return (
              <div
                key={key}
                className={`sidebar-nav-group${item.dividerBefore ? ' sidebar-nav-group--divided' : ''}`}
              >
                <button
                  className={`sidebar-nav-item sidebar-nav-item-expandable ${
                    isItemActive(item) ? 'sidebar-nav-item-active' : ''
                  }`}
                  onClick={() => toggleSubmenu(item.label)}
                  title={itemTitle}
                  aria-label={itemTitle}
                >
                  <span className="sidebar-nav-icon">{item.icon}</span>
                  <span className="sidebar-nav-label">{item.label}</span>
                  <span className="sidebar-nav-chevron">
                    {submenuOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </span>
                </button>
                {submenuOpen && !isCollapsed ? (
                  <div className="sidebar-submenu">
                    {item.children!.map((sub) => (
                      <NavLink
                        key={sub.key ?? sub.path}
                        to={sub.path}
                        className={({ isActive }) =>
                          `sidebar-submenu-item ${isActive ? 'sidebar-submenu-item-active' : ''}`
                        }
                        onClick={handleLinkClick}
                        onMouseEnter={() => onPrefetchPath?.(sub.path)}
                        onFocus={() => onPrefetchPath?.(sub.path)}
                      >
                        {sub.label}
                      </NavLink>
                    ))}
                  </div>
                ) : null}
              </div>
            )
          }

          return (
            <NavLink
              key={key}
              to={item.path ?? '/'}
              className={({ isActive }) =>
                `sidebar-nav-item${item.dividerBefore ? ' sidebar-nav-item--divided' : ''}${
                  isActive || isItemActive(item) ? ' sidebar-nav-item-active' : ''
                }`
              }
              onClick={handleLinkClick}
              onMouseEnter={() => item.path && onPrefetchPath?.(item.path)}
              onFocus={() => item.path && onPrefetchPath?.(item.path)}
              title={itemTitle}
              aria-label={itemTitle}
            >
              <span className="sidebar-nav-icon">{item.icon}</span>
              <span className="sidebar-nav-label">{item.label}</span>
            </NavLink>
          )
        })}
      </nav>
    </aside>
  )
}
