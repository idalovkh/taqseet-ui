import type { KeyboardEvent, ReactNode } from 'react'
import { MobileGroupDivider, MobileStaticRow } from '@/shared/components/ui/MobileStaticRow'
import './IosListCard.css'

export type IosListCardTone = 'default' | 'warning' | 'danger'

export interface IosListCardRowData {
  label: string
  value: ReactNode
  valueVariant?: 'default' | 'primary' | 'amount'
  dividerBefore?: boolean
}

export interface IosListCardProps {
  tone?: IosListCardTone
  eyebrow?: ReactNode
  title: ReactNode
  badge?: ReactNode
  actions?: ReactNode
  rows?: IosListCardRowData[]
  onClick?: () => void
  className?: string
}

function cardClassName(tone: IosListCardTone, clickable: boolean, extra?: string): string {
  return [
    'ios-list-card',
    `ios-list-card--${tone}`,
    clickable ? 'ios-list-card--clickable' : '',
    extra ?? '',
  ]
    .filter(Boolean)
    .join(' ')
}

export function IosListCard({
  tone = 'default',
  eyebrow,
  title,
  badge,
  actions,
  rows = [],
  onClick,
  className,
}: IosListCardProps) {
  const clickable = Boolean(onClick)

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!clickable || !onClick) return
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onClick()
    }
  }

  return (
    <div
      className={cardClassName(tone, clickable, className)}
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
      onClick={clickable ? onClick : undefined}
      onKeyDown={clickable ? handleKeyDown : undefined}
    >
      <div className="mobile-nav-group ios-list-card__group">
        <div className="ios-list-card__hero">
          {(eyebrow != null || badge != null) ? (
            <div className="ios-list-card__hero-top">
              {eyebrow != null ? (
                <span className="ios-list-card__eyebrow">{eyebrow}</span>
              ) : (
                <span className="ios-list-card__eyebrow" aria-hidden="true" />
              )}
              {badge != null ? <span className="ios-list-card__badge">{badge}</span> : null}
            </div>
          ) : null}
          <div className="ios-list-card__hero-main">
            <div className="ios-list-card__title">{title}</div>
            {actions != null ? (
              <span
                className="ios-list-card__actions"
                onClick={(event) => event.stopPropagation()}
                onKeyDown={(event) => event.stopPropagation()}
              >
                {actions}
              </span>
            ) : null}
          </div>
        </div>

        {rows.map((row, index) => (
          <span key={`${row.label}-${index}`}>
            {row.dividerBefore ? <MobileGroupDivider /> : null}
            <MobileStaticRow
              label={row.label}
              value={row.value}
              valueVariant={row.valueVariant}
            />
          </span>
        ))}
      </div>
    </div>
  )
}

interface IosListCardListProps {
  children: ReactNode
  className?: string
}

export function IosListCardList({ children, className }: IosListCardListProps) {
  return (
    <div className={['ios-list-card-list', className].filter(Boolean).join(' ')}>
      {children}
    </div>
  )
}

interface IosListCardEmptyProps {
  text: string
}

export function IosListCardEmpty({ text }: IosListCardEmptyProps) {
  return (
    <IosListCardList>
      <div className="mobile-nav-group ios-list-card-empty">
        <p className="ios-list-card-empty__text">{text}</p>
      </div>
    </IosListCardList>
  )
}

interface IosListCardSkeletonProps {
  count?: number
}

export function IosListCardSkeleton({ count = 3 }: IosListCardSkeletonProps) {
  return (
    <IosListCardList className="ios-list-card-list--loading">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="ios-list-card ios-list-card--skeleton" aria-hidden="true">
          <div className="mobile-nav-group ios-list-card__group">
            <div className="ios-list-card__hero ios-list-card__hero--skeleton" />
            <div className="ios-list-card__row-skeleton" />
            <div className="ios-list-card__row-skeleton" />
            <div className="ios-list-card__row-skeleton" />
          </div>
        </div>
      ))}
    </IosListCardList>
  )
}

export function toneFromRowClassName(className: string): IosListCardTone {
  if (className.includes('danger') || className.includes('overdue')) return 'danger'
  if (className.includes('warning')) return 'warning'
  return 'default'
}
