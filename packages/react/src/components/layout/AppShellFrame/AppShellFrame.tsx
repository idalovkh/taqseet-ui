import type { ReactNode } from 'react'
import './AppShellFrame.css'

export interface AppShellFrameProps {
  header: ReactNode
  sidebar: ReactNode
  children: ReactNode
  layoutClassName: string
  showSidebar: boolean
  className?: string
  mainClassName?: string
}

export function AppShellFrame({
  header,
  sidebar,
  children,
  layoutClassName,
  showSidebar,
  className = '',
  mainClassName = '',
}: AppShellFrameProps) {
  return (
    <div className={`${layoutClassName} ${className}`.trim()}>
      <header className="app-shell-frame__header">{header}</header>

      <div className="app-shell-frame__workspace">
        {showSidebar ? (
          <aside className="app-shell-frame__sidebar" aria-label="Navigation">
            {sidebar}
          </aside>
        ) : null}

        <main className={`app-shell-frame__main ${mainClassName}`.trim()}>{children}</main>
      </div>
    </div>
  )
}
