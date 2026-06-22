import React, { useEffect, useLayoutEffect, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { useBreakpoint } from '@/shared/hooks/useBreakpoint'
import { DismissButton } from '@/shared/components/ui/CircleIconButton'
import { useFullscreenOverlay } from '@/shared/contexts/FullscreenOverlayContext'
import { FullscreenModalHeader } from './FullscreenModalHeader'
import { ModalPortalProvider } from './ModalPortalContext'
import './Modal.css'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  titleIcon?: ReactNode
  subtitle?: string
  children: React.ReactNode
  size?: 'small' | 'medium' | 'large' | 'xlarge' | 'agreement' | 'passport'
  /** На мобильном: весь экран, без шапки модалки; layout не рендерит app header (через FullscreenOverlayContext) */
  fullScreenOnMobile?: boolean
  /** Мобильная презентация модалки: sheet (снизу) или centered (по центру, компактно) */
  mobileMode?: 'sheet' | 'centered'
  overlayClassName?: string
  contentClassName?: string
  bodyClassName?: string
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  titleIcon,
  subtitle,
  children,
  size = 'medium',
  fullScreenOnMobile = false,
  mobileMode = 'sheet',
  overlayClassName,
  contentClassName,
  bodyClassName,
}) => {
  const { isMobile } = useBreakpoint()
  const contentRef = useRef<HTMLDivElement | null>(null)
  const fullscreenOverlay = useFullscreenOverlay()

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = ''
      }
    }
  }, [isOpen])

  // Контракт для layout: fullscreen overlay сообщает через контекст — layout не рендерит app header
  useEffect(() => {
    if (isOpen && fullScreenOnMobile && isMobile) {
      fullscreenOverlay?.setActive(true)
      return () => fullscreenOverlay?.setActive(false)
    }
  }, [isOpen, fullScreenOnMobile, isMobile, fullscreenOverlay])

  // Fullscreen: при открытии скролл body в начало (шапка вне скролла, всегда видна)
  useLayoutEffect(() => {
    if (isOpen && fullScreenOnMobile && isMobile) {
      const body = contentRef.current?.querySelector('.modal-body')
      if (body) (body as HTMLElement).scrollTop = 0
    }
  }, [isOpen, fullScreenOnMobile, isMobile])

  if (!isOpen) return null

  const overlayClass = [
    'modal-overlay',
    fullScreenOnMobile && 'modal-fullscreen-mobile',
    !fullScreenOnMobile && mobileMode === 'centered' && 'modal-mobile-centered',
    overlayClassName,
  ].filter(Boolean).join(' ')
  const contentClass = [
    'modal-content',
    `modal-${size}`,
    fullScreenOnMobile && 'modal-fullscreen-mobile',
    !fullScreenOnMobile && mobileMode === 'centered' && 'modal-mobile-centered',
    contentClassName,
  ].filter(Boolean).join(' ')
  const modalBodyClass = ['modal-body', bodyClassName].filter(Boolean).join(' ')

  /* Взаимоисключающе: fullscreen на мобильном — только FullscreenModalHeader, иначе — modal-header */
  const useFullscreenHeader = fullScreenOnMobile && isMobile

  const content = (
    <div ref={contentRef} className={contentClass} onClick={(e) => e.stopPropagation()}>
      {useFullscreenHeader ? (
        <FullscreenModalHeader
          title={title}
          titleIcon={titleIcon}
          subtitle={subtitle}
          onClose={onClose}
        />
      ) : title ? (
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <DismissButton size="sm" onClick={onClose} />
        </div>
      ) : null}
      <div className={modalBodyClass}>{children}</div>
    </div>
  )

  return createPortal(
    <ModalPortalProvider containerRef={contentRef}>
      <div className={overlayClass} onClick={onClose}>
        {content}
      </div>
    </ModalPortalProvider>,
    document.body
  )
}
