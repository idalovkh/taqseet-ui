import type { ReactNode } from 'react'
import { AppShellFrame } from '../AppShellFrame'
import { useAppShellSidebar, type UseAppShellSidebarResult } from '../../../hooks/useAppShellSidebar'
import { AppShellHeader } from './AppShellHeader'
import { AppShellSidebar } from './AppShellSidebar'
import type { AppShellBrand, AppShellHeaderAction, AppShellNavItem } from './AppShell.types'
import './AppShell.css'

export interface AppShellProps {
  children: ReactNode
  navItems: AppShellNavItem[]
  brand: AppShellBrand
  accountMenu?: ReactNode
  rightHeaderSlot?: ReactNode
  headerActions?: AppShellHeaderAction[]
  shellState?: UseAppShellSidebarResult
  showMenuButton?: boolean
  className?: string
  mainClassName?: string
  onPrefetchPath?: (path: string) => void
}

export function AppShell({
  children,
  navItems,
  brand,
  accountMenu,
  rightHeaderSlot,
  headerActions,
  shellState,
  showMenuButton = false,
  className,
  mainClassName,
  onPrefetchPath,
}: AppShellProps) {
  const shell = shellState ?? useAppShellSidebar()
  const isMobileLike = shell.isMobile || shell.isTablet

  return (
    <AppShellFrame
      layoutClassName={shell.layoutClassName}
      showSidebar={shell.showSidebar}
      onDesktopSidebarMouseEnter={shell.handleDesktopSidebarMouseEnter}
      onDesktopSidebarMouseLeave={shell.handleDesktopSidebarMouseLeave}
      onDesktopSidebarBackdropClick={shell.toggleSidebar}
      className={className}
      mainClassName={mainClassName}
      header={
        <AppShellHeader
          brand={brand}
          onMenuClick={shell.toggleSidebar}
          sidebarOpen={shell.sidebarOpen || shell.sidebarHoverExpanded}
          showMenuButton={showMenuButton}
          actions={headerActions}
          rightSlot={rightHeaderSlot}
          accountMenu={accountMenu}
        />
      }
      sidebar={
        <AppShellSidebar
          navItems={navItems}
          isOpen={shell.sidebarOpen}
          onClose={shell.closeSidebar}
          isMobile={isMobileLike}
          isCollapsed={shell.isDesktop && !shell.sidebarOpen && !shell.sidebarHoverExpanded}
          onExpand={shell.isDesktop && !shell.sidebarOpen ? shell.toggleSidebar : undefined}
          onPrefetchPath={onPrefetchPath}
        />
      }
    >
      {children}
    </AppShellFrame>
  )
}
