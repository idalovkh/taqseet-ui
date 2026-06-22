import { ReactNode } from 'react'
import { MenuBackLink } from '@/shared/components/layout/MenuBackLink'
import './PageContent.css'

export type PageContentVariant = 'default' | 'hub' | 'detail' | 'workspace' | 'full'

interface PageContentProps {
  children: ReactNode
  variant?: PageContentVariant
  className?: string
  /** auto — «← Меню» на touch для разделов вне bottom-nav; hide — управляет родитель */
  menuBack?: 'auto' | 'hide'
}

export function PageContent({
  children,
  variant = 'default',
  className,
  menuBack = 'auto',
}: PageContentProps) {
  const classes = ['page-content', `page-content--${variant}`, className]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={classes}>
      {menuBack !== 'hide' ? <MenuBackLink className="page-content__menu-back" /> : null}
      {children}
    </div>
  )
}
