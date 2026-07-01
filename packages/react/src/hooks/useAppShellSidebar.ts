import { useCallback, useEffect, useMemo, useState } from 'react'
import { useBreakpoint } from './useBreakpoint'

export interface UseAppShellSidebarOptions {
  storageKey?: string
}

export interface UseAppShellSidebarResult {
  sidebarOpen: boolean
  sidebarHoverExpanded: boolean
  toggleSidebar: () => void
  closeSidebar: () => void
  handleDesktopSidebarMouseEnter: () => void
  handleDesktopSidebarMouseLeave: () => void
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
  const isDesktop = !isMobile && !isTablet

  const getInitialSidebarState = () => {
    if (typeof window === 'undefined') return true

    if (isMobile || isTablet) {
      return false
    }

    const stored = localStorage.getItem(storageKey)
    return stored !== null ? stored === 'true' : true
  }

  const [sidebarOpen, setSidebarOpen] = useState(getInitialSidebarState)
  const [sidebarHoverExpanded, setSidebarHoverExpanded] = useState(false)
  const [hoverCloseTimeoutId, setHoverCloseTimeoutId] = useState<number | null>(null)

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
    if (isDesktop) {
      return
    }
    setSidebarOpen(false)
  }, [isDesktop])

  const clearHoverCloseTimeout = useCallback(() => {
    if (hoverCloseTimeoutId !== null) {
      window.clearTimeout(hoverCloseTimeoutId)
      setHoverCloseTimeoutId(null)
    }
  }, [hoverCloseTimeoutId])

  const handleDesktopSidebarMouseEnter = useCallback(() => {
    if (!isDesktop || sidebarOpen) return
    clearHoverCloseTimeout()
    setSidebarHoverExpanded(true)
  }, [clearHoverCloseTimeout, isDesktop, sidebarOpen])

  const handleDesktopSidebarMouseLeave = useCallback(() => {
    if (!isDesktop || sidebarOpen) return
    clearHoverCloseTimeout()
    const timeoutId = window.setTimeout(() => {
      setSidebarHoverExpanded(false)
      setHoverCloseTimeoutId(null)
    }, 140)
    setHoverCloseTimeoutId(timeoutId)
  }, [clearHoverCloseTimeout, isDesktop, sidebarOpen])

  useEffect(() => {
    if (isMobile || isTablet) {
      setSidebarOpen(false)
      setSidebarHoverExpanded(false)
      clearHoverCloseTimeout()
    }
  }, [clearHoverCloseTimeout, isMobile, isTablet])

  useEffect(
    () => () => {
      if (hoverCloseTimeoutId !== null) {
        window.clearTimeout(hoverCloseTimeoutId)
      }
    },
    [hoverCloseTimeoutId],
  )

  const layoutClassName = useMemo(
    () =>
      [
        'app-shell-frame',
        isMobile ? 'app-shell-frame--mobile' : isTablet ? 'app-shell-frame--tablet' : 'app-shell-frame--desktop',
        sidebarOpen ? 'app-shell-frame--sidebar-open' : 'app-shell-frame--sidebar-closed',
        !sidebarOpen && sidebarHoverExpanded ? 'app-shell-frame--sidebar-hover-expanded' : '',
      ]
        .filter(Boolean)
        .join(' '),
    [isMobile, isTablet, sidebarHoverExpanded, sidebarOpen],
  )

  return {
    sidebarOpen,
    sidebarHoverExpanded,
    toggleSidebar,
    closeSidebar,
    handleDesktopSidebarMouseEnter,
    handleDesktopSidebarMouseLeave,
    isDesktop,
    isMobile,
    isTablet,
    layoutClassName,
    showSidebar: isDesktop || sidebarOpen,
  }
}
