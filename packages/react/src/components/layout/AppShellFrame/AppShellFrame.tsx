import type { ReactNode } from 'react'
import './AppShellFrame.css'

export interface AppShellFrameProps {
  header: ReactNode
  sidebar: ReactNode
  children: ReactNode
  layoutClassName: string
  showSidebar: boolean
  onDesktopSidebarMouseEnter?: () => void
  onDesktopSidebarMouseLeave?: () => void
  onDesktopSidebarBackdropClick?: () => void
  className?: string
  mainClassName?: string
}

export function AppShellFrame({
  header,
  sidebar,
  children,
  layoutClassName,
  showSidebar,
  onDesktopSidebarMouseEnter,
  onDesktopSidebarMouseLeave,
  onDesktopSidebarBackdropClick,
  className = '',
  mainClassName = '',
}: AppShellFrameProps) {
  return (
    <div className={`${layoutClassName} ${className}`.trim()}>
      <header className="app-shell-frame__header">{header}</header>

      <div className="app-shell-frame__workspace">
        <div className="app-shell-frame__sidebar-rail-spacer" aria-hidden />
        <button
          type="button"
          className="app-shell-frame__sidebar-backdrop"
          aria-label="Collapse sidebar"
          onClick={onDesktopSidebarBackdropClick}
        />
        {showSidebar ? (
          <aside
            className="app-shell-frame__sidebar"
            aria-label="Navigation"
            onMouseEnter={onDesktopSidebarMouseEnter}
            onMouseLeave={onDesktopSidebarMouseLeave}
          >
            {sidebar}
          </aside>
        ) : null}

        <main className={`app-shell-frame__main ${mainClassName}`.trim()}>{children}</main>
      </div>
    </div>
  )
}
