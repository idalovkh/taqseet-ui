import type { ReactNode } from 'react'
import './ListIosCardsLayout.css'

export type ListIosCardsLayoutVariant = 'page' | 'inset'

interface ListIosCardsLayoutProps {
  variant?: ListIosCardsLayoutVariant
  children: ReactNode
  className?: string
}

export function ListIosCardsLayout({
  variant = 'page',
  children,
  className,
}: ListIosCardsLayoutProps) {
  return (
    <div
      className={[
        'list-ios-cards-layout',
        variant === 'page' ? 'list-ios-cards-layout--page' : 'list-ios-cards-layout--inset',
        className ?? '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  )
}
