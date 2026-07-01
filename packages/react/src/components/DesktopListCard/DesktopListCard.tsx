import type { KeyboardEvent, ReactNode } from 'react'
import './DesktopListCard.css'

interface DesktopListCardsGridProps {
  children: ReactNode
  className?: string
}

export function DesktopListCardsGrid({ children, className }: DesktopListCardsGridProps) {
  return (
    <div className={['desktop-list-cards-grid', className].filter(Boolean).join(' ')}>
      {children}
    </div>
  )
}

interface DesktopListCardProps {
  children: ReactNode
  className?: string
  onClick?: () => void
}

export function DesktopListCard({ children, className, onClick }: DesktopListCardProps) {
  const clickable = Boolean(onClick)

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (!clickable || !onClick) return
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onClick()
    }
  }

  return (
    <article
      className={[
        'desktop-list-card',
        clickable ? 'desktop-list-card--clickable' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
      onClick={onClick}
      onKeyDown={handleKeyDown}
    >
      {children}
    </article>
  )
}

interface DesktopListCardPlaceholderProps {
  className?: string
}

export function DesktopListCardPlaceholder({ className }: DesktopListCardPlaceholderProps) {
  return (
    <div
      className={['desktop-list-card', 'desktop-list-card--placeholder', className]
        .filter(Boolean)
        .join(' ')}
      aria-hidden="true"
    />
  )
}

interface DesktopListCardHeaderProps {
  children: ReactNode
  className?: string
}

export function DesktopListCardHeader({ children, className }: DesktopListCardHeaderProps) {
  return (
    <div className={['desktop-list-card__header', className].filter(Boolean).join(' ')}>
      {children}
    </div>
  )
}

interface DesktopListCardTitleProps {
  children: ReactNode
  className?: string
}

export function DesktopListCardTitle({ children, className }: DesktopListCardTitleProps) {
  return (
    <h3 className={['desktop-list-card__title', className].filter(Boolean).join(' ')}>
      {children}
    </h3>
  )
}

interface DesktopListCardStatusProps {
  children: ReactNode
  className?: string
}

export function DesktopListCardStatus({ children, className }: DesktopListCardStatusProps) {
  return (
    <div className={['desktop-list-card__status', className].filter(Boolean).join(' ')}>
      {children}
    </div>
  )
}

interface DesktopListCardFieldProps {
  label: ReactNode
  value: ReactNode
  className?: string
  labelClassName?: string
  valueClassName?: string
  valueVariant?: 'default' | 'primary' | 'amount'
  dividerBefore?: boolean
}

export function DesktopListCardField({
  label,
  value,
  className,
  labelClassName,
  valueClassName,
  valueVariant = 'default',
  dividerBefore = false,
}: DesktopListCardFieldProps) {
  return (
    <div
      className={[
        'desktop-list-card__field',
        dividerBefore ? 'desktop-list-card__field--with-divider' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <span className={['desktop-list-card__label', labelClassName].filter(Boolean).join(' ')}>
        {label}
      </span>
      <span
        className={[
          'desktop-list-card__value',
          `desktop-list-card__value--${valueVariant}`,
          valueClassName,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {value}
      </span>
    </div>
  )
}

interface DesktopListCardActionsProps {
  children: ReactNode
  className?: string
}

export function DesktopListCardActions({ children, className }: DesktopListCardActionsProps) {
  return (
    <div
      className={['desktop-list-card__actions', className].filter(Boolean).join(' ')}
      onClick={(event) => event.stopPropagation()}
      onKeyDown={(event) => event.stopPropagation()}
    >
      {children}
    </div>
  )
}
