/**
 * Контекст fullscreen overlay: модалка сообщает layout, что открыта в fullscreen,
 * layout не рендерит app header (вместо display:none).
 */

import React, { createContext, useContext, useState, useCallback } from 'react'

interface FullscreenOverlayContextValue {
  isActive: boolean
  setActive: (active: boolean) => void
}

const FullscreenOverlayContext = createContext<FullscreenOverlayContextValue | null>(null)

export function FullscreenOverlayProvider({ children }: { children: React.ReactNode }) {
  const [isActive, setIsActive] = useState(false)
  const setActive = useCallback((active: boolean) => setIsActive(active), [])
  return (
    <FullscreenOverlayContext.Provider value={{ isActive, setActive }}>
      {children}
    </FullscreenOverlayContext.Provider>
  )
}

export function useFullscreenOverlay(): FullscreenOverlayContextValue | null {
  return useContext(FullscreenOverlayContext)
}
