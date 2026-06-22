/**
 * KpiSummary - Generic KPI summary component
 *
 * Displays a grid of KPI cards with consistent layout and responsive behavior.
 * Used across different pages for displaying key metrics.
 */

import type { CSSProperties } from 'react'
import './KpiSummary.css'
import { Tooltip } from '@/shared/components/ui/Tooltip'

export interface KpiItem {
  label: string
  value: string | number
  /** Подсказка при наведении на карточку */
  tooltip?: string
  details?: Array<{
    label: string
    value: string | number
    variant?: 'incoming' | 'outgoing' | 'neutral'
  }>
  valueVariant?: 'positive' | 'negative' | 'neutral'
}

export type KpiSummaryLayout = 'stretch' | 'fit'

export interface KpiSummaryProps {
  items: KpiItem[]
  loading?: boolean
  /** Число placeholder-карточек при loading, если items ещё пустой */
  skeletonCount?: number
  /** Компактная сводка для list-страниц (2×2 на mobile, grouped-card) */
  variant?: 'default' | 'list'
  /** Текст, если после загрузки нет метрик для отображения */
  emptyMessage?: string
  /** Число колонок для list-варианта (по умолчанию — из items/skeletonCount) */
  columns?: number
  /** stretch — на всю ширину; fit — пропорционально содержимому */
  layout?: KpiSummaryLayout
  /** Минимальная ширина ячейки KPI (list + fit) */
  minItemWidth?: string
  /** Максимальная ширина ячейки KPI (list + fit) */
  maxItemWidth?: string
}

function resolveListColumns(
  columns: number | undefined,
  itemsLength: number,
  skeletonCount: number
): number {
  if (columns != null) return columns
  if (itemsLength > 0) return itemsLength
  return skeletonCount
}

function buildRootClassName(
  variant: 'default' | 'list',
  layout: KpiSummaryLayout | undefined,
  columns: number | undefined,
  extra?: string
): string {
  const parts = [variant === 'list' ? 'kpi-summary kpi-summary--list' : 'kpi-summary']

  if (variant === 'list') {
    const listLayout = layout ?? 'fit'
    parts.push(listLayout === 'stretch' ? 'kpi-summary--stretch' : 'kpi-summary--fit')
    if (columns != null && columns >= 1 && columns <= 8) {
      parts.push(`kpi-summary--cols-${columns}`)
    }
  }

  if (extra) parts.push(extra)
  return parts.join(' ')
}

function buildListStyle(
  variant: 'default' | 'list',
  minItemWidth?: string,
  maxItemWidth?: string
): CSSProperties | undefined {
  if (variant !== 'list') return undefined
  if (!minItemWidth && !maxItemWidth) return undefined

  return {
    ...(minItemWidth ? { '--kpi-summary-min-item-width': minItemWidth } : {}),
    ...(maxItemWidth ? { '--kpi-summary-max-item-width': maxItemWidth } : {}),
  } as CSSProperties
}

export const KpiSummary = ({
  items,
  loading,
  skeletonCount = 4,
  variant = 'default',
  emptyMessage,
  columns,
  layout,
  minItemWidth,
  maxItemWidth,
}: KpiSummaryProps) => {
  const listColumns =
    variant === 'list' ? resolveListColumns(columns, items.length, skeletonCount) : undefined

  const rootClass = buildRootClassName(variant, layout, listColumns)
  const rootStyle = buildListStyle(variant, minItemWidth, maxItemWidth)

  if (!loading && items.length === 0) {
    if (!emptyMessage) return null
    return (
      <div
        className={`${rootClass} kpi-summary--empty`}
        style={rootStyle}
        role="status"
      >
        <p className="kpi-summary-empty-text">{emptyMessage}</p>
      </div>
    )
  }

  if (loading) {
    const count = Math.max(items.length, skeletonCount)
    return (
      <div
        className={`${rootClass} kpi-summary-loading`}
        style={rootStyle}
      >
        {Array.from({ length: count }, (_, index) => (
          <div key={index} className="kpi-item">
            <div className="kpi-skeleton" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className={rootClass} style={rootStyle}>
      {items.map((item, index) => (
        <div key={index} className="kpi-item">
          <span className="kpi-label">
            {item.label}
            {item.tooltip && (
              <Tooltip
                content={item.tooltip}
                placement="right"
                alignment="start"
                tooltipClassName="portfolio-overview-tooltip"
              >
                <span className="tooltip-trigger" aria-hidden="true">
                  i
                </span>
              </Tooltip>
            )}
          </span>
          <span
            className={`kpi-value ${item.valueVariant ? `kpi-value-${item.valueVariant}` : ''}`}
          >
            {item.value}
          </span>
          {item.details && item.details.length > 0 && (
            <div className="kpi-details">
              {item.details.map((detail, detailIndex) => (
                <span
                  key={detailIndex}
                  className={`kpi-detail ${detail.variant ? `kpi-detail-${detail.variant}` : ''}`}
                >
                  {detail.label}: {detail.value}
                </span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
