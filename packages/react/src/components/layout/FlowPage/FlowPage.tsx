import React, { ReactNode, useEffect } from 'react'
import { FullscreenModalHeader } from '@/shared/components/ui/Modal/FullscreenModalHeader'
import { useFullscreenOverlay } from '@/shared/contexts/FullscreenOverlayContext'
import { useBreakpoint } from '@/shared/hooks/useBreakpoint'
import './FlowPage.css'

interface FlowPageProps {
  title?: string
  titleIcon?: ReactNode
  subtitle?: string
  closeLabel?: string
  onClose: () => void
  children: ReactNode
  className?: string
}

export const FlowPage: React.FC<FlowPageProps> = ({
  title,
  titleIcon,
  subtitle,
  closeLabel,
  onClose,
  children,
  className,
}) => {
  const fullscreenOverlay = useFullscreenOverlay()
  const { isMobile, isTablet } = useBreakpoint()
  const isMobileLike = isMobile || isTablet

  useEffect(() => {
    if (!isMobileLike) return
    fullscreenOverlay?.setActive(true)
    return () => fullscreenOverlay?.setActive(false)
  }, [fullscreenOverlay, isMobileLike])

  const rootClassName = ['flow-page', className].filter(Boolean).join(' ')

  return (
    <section className={rootClassName}>
      <FullscreenModalHeader
        title={title}
        titleIcon={titleIcon}
        subtitle={subtitle}
        onClose={onClose}
        closeLabel={closeLabel}
      />
      <div className="flow-page-body">{children}</div>
    </section>
  )
}
