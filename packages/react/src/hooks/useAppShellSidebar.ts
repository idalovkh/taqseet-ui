import { useCallback, useEffect, useMemo, useState } from 'react'
import { useBreakpoint } from './useBreakpoint'

export interface UseAppShellSidebarOptions {
  storageKey?: string
}

export interface UseAppShellSidebarResult {
  sidebarOpen: boolean
  toggleSidebar: () => void
  closeSidebar: () => void
  isDesktop: boolean
  isMobile: boolean
  isTablet: boolean
  layoutClassName: string
  showSidebar: boolean
}

export function useAppShellSidebar(
  options: UseAppShellSidebarOptions = {},
): UseAppShellSidebarResult {
  const { storageKey = 'sidebarOpen' } = options
  const { isMobile, isTablet } = useBreakpoint()

  const getInitialSidebarState = () => {
    if (typeof window === 'undefined') return true

    if (isMobile || isTablet) {
      return false
    }

    const stored = localStorage.getItem(storageKey)
    return stored !== null ? stored === 'true' : true
  }

  const [sidebarOpen, setSidebarOpen] = useState(getInitialSidebarState)

  const updateSidebarState = useCallback(
    (open: boolean) => {
      setSidebarOpen(open)
      localStorage.setItem(storageKey, String(open))
    },
    [storageKey],
  )

  const toggleSidebar = useCallback(() => {
    updateSidebarState(!sidebarOpen)
  }, [sidebarOpen, updateSidebarState])

  const closeSidebar = useCallback(() => {
    const isDesktop = !isMobile && !isTablet
    if (isDesktop) {
      return
    }
    setSidebarOpen(false)
  }, [isMobile, isTablet])

  useEffect(() => {
    if (isMobile || isTablet) {
      setSidebarOpen(false)
    }
  }, [isMobile, isTablet])

  const isDesktop = !isMobile && !isTablet

  const layoutClassName = useMemo(
    () =>
      [
        'app-shell-frame',
        isMobile ? 'app-shell-frame--mobile' : isTablet ? 'app-shell-frame--tablet' : 'app-shell-frame--desktop',
        sidebarOpen ? 'app-shell-frame--sidebar-open' : 'app-shell-frame--sidebar-closed',
      ]
        .filter(Boolean)
        .join(' '),
    [isMobile, isTablet, sidebarOpen],
  )

  return {
    sidebarOpen,
    toggleSidebar,
    closeSidebar,
    isDesktop,
    isMobile,
    isTablet,
    layoutClassName,
    showSidebar: isDesktop || sidebarOpen,
  }
}
