import React, { type ReactNode } from 'react'
import { PageTitleRow } from '@/shared/components/layout/PageTitleRow'
import './FullscreenModalHeader.css'

/**
 * Шапка только для fullscreen-модалок на мобильном.
 * Контракт: safe-area сверху встроен, без position:fixed — flex + sticky,
 * чтобы контент не перекрывался.
 */
export interface FullscreenModalHeaderProps {
  title?: string
  titleIcon?: ReactNode
  subtitle?: string
  onClose: () => void
  closeLabel?: string
}

export const FullscreenModalHeader: React.FC<FullscreenModalHeaderProps> = ({
  title,
  titleIcon,
  subtitle,
  onClose,
  closeLabel = 'Назад',
}) => (
  <header className="fullscreen-modal-header" role="banner">
    <PageTitleRow
      title={title ?? ''}
      titleIcon={titleIcon}
      subtitle={subtitle}
      titleTag="h2"
      backAction={{ type: 'button', onClick: onClose, ariaLabel: closeLabel }}
    />
  </header>
)
