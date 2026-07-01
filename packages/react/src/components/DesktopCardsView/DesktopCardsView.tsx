import type { ReactNode, Ref } from 'react'
import {
  DesktopListCardsGrid,
  DesktopListCard,
  DesktopListCardPlaceholder,
  DesktopListCardHeader,
  DesktopListCardTitle,
  DesktopListCardStatus,
  DesktopListCardField,
  DesktopListCardActions,
} from '../DesktopListCard'
import type { TableColumn } from '../Table'
import './DesktopCardsView.css'

const DESKTOP_CARD_BODY_MAX_FIELDS = 4

type DesktopCardRole = 'heroEyebrow' | 'heroTitle' | 'heroBadge' | 'heroActions' | 'body' | 'hidden'

function inferDesktopCardRole<T>(column: TableColumn<T>): DesktopCardRole {
  if (column.desktopCard?.role) return column.desktopCard.role
  if (column.mobileCard?.role) return column.mobileCard.role
  if (column.key === 'actions') return 'hidden'
  if (column.key === 'status') return 'heroBadge'
  if (column.key === 'displayNumber' || column.key === 'number' || column.key === 'agreementNumber') {
    return 'heroEyebrow'
  }
  return 'body'
}

function renderColumnValue<T>(column: TableColumn<T>, record: T, index: number): ReactNode | null {
  const cellValue = column.dataIndex ? record[column.dataIndex] : null
  const rendered = column.render
    ? column.render(cellValue, record, index)
    : cellValue != null
      ? String(cellValue)
      : null
  return rendered ?? null
}

export interface DesktopCardsViewProps<T> {
  columns: TableColumn<T>[]
  data: T[]
  loading?: boolean
  rowKey?: (record: T) => string
  rowClassName?: (record: T) => string
  onRowClick?: (record: T) => void
  emptyText?: string
  wrapperClassName?: string
  wrapperRef?: Ref<HTMLDivElement>
  skeletonRows?: number
}

export function DesktopCardsView<T = Record<string, unknown>>({
  columns,
  data,
  loading = false,
  rowKey = (record) => ((record as { id?: string | number }).id as string) || String(record),
  rowClassName,
  onRowClick,
  emptyText = 'Нет данных',
  wrapperClassName,
  wrapperRef,
  skeletonRows = 5,
}: DesktopCardsViewProps<T>) {
  const cardsClassName = ['desktop-cards-view', wrapperClassName].filter(Boolean).join(' ')
  const showLoading = loading && data.length === 0

  if (showLoading) {
    return (
      <div className={cardsClassName} ref={wrapperRef}>
        <DesktopListCardsGrid className="desktop-cards-view__grid">
          {Array.from({ length: Math.min(Math.max(skeletonRows, 1), 6) }).map((_, index) => (
            <DesktopListCardPlaceholder key={index} />
          ))}
        </DesktopListCardsGrid>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className={cardsClassName} ref={wrapperRef}>
        <DesktopListCardsGrid className="desktop-cards-view__grid desktop-cards-view__grid--empty">
          <div className="desktop-cards-view__empty">{emptyText}</div>
        </DesktopListCardsGrid>
      </div>
    )
  }

  return (
    <div className={cardsClassName} ref={wrapperRef}>
      <DesktopListCardsGrid className="desktop-cards-view__grid">
        {data.map((record, index) => {
          const customClassName = rowClassName ? rowClassName(record) : ''
          const resolved = columns
            .map((column) => ({
              column,
              role: inferDesktopCardRole(column),
              value: renderColumnValue(column, record, index),
            }))
            .filter((item) => item.role !== 'hidden' && item.value != null)

          const titleItem =
            resolved.find((item) => item.role === 'heroTitle') ??
            resolved.find((item) => item.role === 'body')
          const eyebrowItem = resolved.find((item) => item.role === 'heroEyebrow')
          const badgeItem = resolved.find((item) => item.role === 'heroBadge')
          const actionsItem = resolved.find((item) => item.role === 'heroActions')

          const rows = resolved
            .filter(
              (item) =>
                item !== titleItem &&
                item !== eyebrowItem &&
                item !== badgeItem &&
                item !== actionsItem &&
                item.role === 'body'
            )
            .slice(0, DESKTOP_CARD_BODY_MAX_FIELDS)

          return (
            <DesktopListCard
              key={rowKey(record)}
              className={customClassName}
              onClick={onRowClick ? () => onRowClick(record) : undefined}
            >
              <DesktopListCardHeader>
                <div className="desktop-cards-view__title-wrap">
                  {eyebrowItem ? (
                    <span className="desktop-cards-view__eyebrow">{eyebrowItem.value}</span>
                  ) : null}
                  <DesktopListCardTitle>{titleItem?.value ?? '—'}</DesktopListCardTitle>
                </div>
                {(badgeItem || actionsItem) ? (
                  <DesktopListCardStatus>
                    {actionsItem ? (
                      <DesktopListCardActions className="desktop-cards-view__actions">
                        {actionsItem.value}
                      </DesktopListCardActions>
                    ) : null}
                    {badgeItem ? badgeItem.value : null}
                  </DesktopListCardStatus>
                ) : null}
              </DesktopListCardHeader>

              {rows.map((item) => (
                <DesktopListCardField
                  key={item.column.key}
                  label={item.column.title}
                  value={item.value}
                  valueVariant={
                    item.column.desktopCard?.valueVariant ?? item.column.mobileCard?.valueVariant
                  }
                  dividerBefore={
                    item.column.desktopCard?.dividerBefore ?? item.column.mobileCard?.dividerBefore
                  }
                />
              ))}
            </DesktopListCard>
          )
        })}
      </DesktopListCardsGrid>
    </div>
  )
}
