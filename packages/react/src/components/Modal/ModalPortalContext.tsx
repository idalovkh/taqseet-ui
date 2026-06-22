import React, { createContext, useContext } from 'react'

/**
 * Ref на контейнер модалки (modal-content) в fullscreen-режиме.
 * Контент, порталящийся в этот контейнер (например дропдаун адреса), остаётся
 * внутри стека модалки и не перекрывает FullscreenModalHeader (z-index: --z-index-header).
 */
const ModalPortalContext = createContext<React.RefObject<HTMLDivElement | null> | null>(null)

export function ModalPortalProvider({
  containerRef,
  children,
}: {
  containerRef: React.RefObject<HTMLDivElement | null> | null
  children: React.ReactNode
}) {
  return (
    <ModalPortalContext.Provider value={containerRef}>
      {children}
    </ModalPortalContext.Provider>
  )
}

export function useModalPortalContainer(): React.RefObject<HTMLDivElement | null> | null {
  return useContext(ModalPortalContext)
}
