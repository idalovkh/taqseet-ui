/**
 * Scroll restoration when returning from detail pages (list → detail → back).
 * Scroll is saved to sessionStorage when leaving the list (saveScrollForPath) and restored here
 * when the list is ready. Key: "scroll:" + pathname + search. Single source of truth, no location.state.
 */

import React, { createContext, useContext, useEffect, type RefObject } from 'react'
import { useLocation } from 'react-router-dom'

const SCROLL_STORAGE_PREFIX = 'scroll:'

interface ScrollRestorationContextValue {
  mainRef: RefObject<HTMLElement | null>
}

export const ScrollRestorationContext = createContext<ScrollRestorationContextValue | null>(null)

export interface ScrollRestorationProviderProps {
  mainRef: RefObject<HTMLElement | null>
  children: React.ReactNode
}

export const ScrollRestorationProvider: React.FC<ScrollRestorationProviderProps> = ({ mainRef, children }) => (
  <ScrollRestorationContext.Provider value={{ mainRef }}>
    {children}
  </ScrollRestorationContext.Provider>
)

/**
 * Call from list pages with isReady = true when content has loaded (e.g. !isLoading).
 * Restores main scroll position from sessionStorage (key "scroll:" + pathname + search), then removes the key.
 */
export function useRestoreScrollWhenReady(isReady: boolean): void {
  const ctx = useContext(ScrollRestorationContext)
  const location = useLocation()

  useEffect(() => {
    if (!isReady) return

    const scrollKey = SCROLL_STORAGE_PREFIX + location.pathname + location.search
    const stored = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem(scrollKey) : null
    if (stored === null || stored === '') return

    const value = Number(stored)
    if (Number.isNaN(value) || value < 0) return

    const el = ctx?.mainRef?.current ?? document.querySelector<HTMLElement>('.app-layout-main')
    if (!el) return

    sessionStorage.removeItem(scrollKey)
    // Apply synchronously so position is set before next paint (reduces visible jerk)
    el.scrollTop = value
    // One rAF backup in case layout wasn't final yet
    const id = requestAnimationFrame(() => { el.scrollTop = value })
    return () => cancelAnimationFrame(id)
  }, [isReady, location.pathname, location.search, ctx?.mainRef])
}
