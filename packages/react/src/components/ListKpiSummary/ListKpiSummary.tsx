import {
  KpiSummary,
  type KpiItem,
  type KpiSummaryLayout,
} from '@/shared/components/ui/KpiSummary'

export interface ListKpiSummaryProps {
  items: KpiItem[]
  loading?: boolean
  skeletonCount?: number
  emptyMessage?: string
  columns?: number
  layout?: KpiSummaryLayout
  minItemWidth?: string
  maxItemWidth?: string
}

/** KPI block for list/workspace pages — always list variant. */
export function ListKpiSummary({
  items,
  loading,
  skeletonCount = 4,
  emptyMessage,
  columns,
  layout = 'fit',
  minItemWidth,
  maxItemWidth,
}: ListKpiSummaryProps) {
  return (
    <KpiSummary
      variant="list"
      items={items}
      loading={loading}
      skeletonCount={skeletonCount}
      emptyMessage={emptyMessage}
      columns={columns}
      layout={layout}
      minItemWidth={minItemWidth}
      maxItemWidth={maxItemWidth}
    />
  )
}
