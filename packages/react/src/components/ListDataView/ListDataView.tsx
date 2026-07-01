import { DesktopCardsView } from '@/shared/components/ui/DesktopCardsView'
import { Table, type TableColumn } from '@/shared/components/ui/Table'
import type { ListViewMode } from '@/shared/components/ui/ListViewModeToggle'

interface ListDataViewProps<T> {
  viewMode: ListViewMode
  columns: TableColumn<T>[]
  data: T[]
  loading?: boolean
  rowKey: (record: T) => string
  onRowClick?: (record: T) => void
  rowClassName?: (record: T) => string
  emptyText?: string
  skeletonRows?: number
  rowCountCacheKey?: string
}

export function ListDataView<T>({
  viewMode,
  columns,
  data,
  loading = false,
  rowKey,
  onRowClick,
  rowClassName,
  emptyText = 'Нет данных',
  skeletonRows = 5,
  rowCountCacheKey,
}: ListDataViewProps<T>) {
  if (viewMode === 'cards') {
    return (
      <DesktopCardsView<T>
        columns={columns}
        data={data}
        loading={loading}
        rowKey={rowKey}
        rowClassName={rowClassName}
        onRowClick={onRowClick}
        emptyText={emptyText}
        skeletonRows={skeletonRows}
      />
    )
  }

  return (
    <Table<T>
      columns={columns}
      data={data}
      loading={loading}
      rowKey={rowKey}
      rowClassName={rowClassName}
      onRowClick={onRowClick}
      emptyText={emptyText}
      skeletonRows={skeletonRows}
      rowCountCacheKey={rowCountCacheKey}
      touchCardLayout="ios"
    />
  )
}
