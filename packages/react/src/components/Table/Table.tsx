import { ReactNode, useCallback, memo, useLayoutEffect, type Ref } from 'react'
import {
  IosListCard,
  IosListCardEmpty,
  IosListCardSkeleton,
  buildIosListCardProps,
  toneFromRowClassName,
} from '@/shared/components/ui/IosListCard'
import { ListIosCardsLayout } from '@/shared/components/ui/ListIosCardsLayout'
import './Table.css'
import '@/shared/components/ui/ListIosCardsLayout/ListIosCardsLayout.css'

const ROW_COUNT_CACHE_PREFIX = 'table-rows:'
/** Нижняя граница minHeight skeleton на list-страницах */
const LIST_TABLE_MIN_HEIGHT_FLOOR = 480
const LIST_TABLE_HEAD_HEIGHT = 44
/** Минимум строк skeleton при загрузке (runtime: 10 → 614px) */
const LIST_TABLE_LOADING_MIN_ROWS = 10
/** Эмпирически из runtime: 9 строк → 558px (558 - 44) / 9 */
const LIST_TABLE_ROW_HEIGHT = 57

function readCachedRowCount(key: string | undefined): number | null {
  if (!key || typeof sessionStorage === 'undefined') return null
  const raw = sessionStorage.getItem(ROW_COUNT_CACHE_PREFIX + key)
  if (raw == null) return null
  const value = Number(raw)
  return Number.isFinite(value) && value > 0 ? Math.min(50, Math.floor(value)) : null
}

function writeCachedRowCount(key: string | undefined, count: number): void {
  if (!key || typeof sessionStorage === 'undefined') return
  sessionStorage.setItem(
    ROW_COUNT_CACHE_PREFIX + key,
    String(Math.max(1, Math.min(50, Math.floor(count))))
  )
}

function buildWrapperClassName(
  dense: boolean,
  touchCardLayout: 'ios' | 'flat',
  touchCardLayoutInset: boolean,
  wrapperClassName?: string
): string {
  const iosCards = touchCardLayout === 'ios'
  return [
    'table-wrapper',
    dense ? 'table-wrapper--dense' : '',
    iosCards ? 'table-wrapper--touch-ios-cards' : '',
    iosCards && touchCardLayoutInset ? 'table-wrapper--touch-ios-inset' : '',
    wrapperClassName ?? '',
  ]
    .filter(Boolean)
    .join(' ')
}

/** minHeight только для skeleton при первичной загрузке desktop-таблиц */
function resolveListLoadingMinHeight(
  touchCardLayout: 'ios' | 'flat',
  rowCount: number
): number | undefined {
  if (touchCardLayout !== 'flat') return undefined
  const rows = Math.max(LIST_TABLE_LOADING_MIN_ROWS, Math.min(50, rowCount))
  return Math.max(LIST_TABLE_MIN_HEIGHT_FLOOR, LIST_TABLE_HEAD_HEIGHT + rows * LIST_TABLE_ROW_HEIGHT)
}

export interface TableColumn<T> {
  key: string
  title: string
  dataIndex?: keyof T
  render?: (value: unknown, record: T, index: number) => ReactNode
  sortable?: boolean
  width?: string
  /** Выравнивание: left — текст, right — числа/деньги/даты, center — статусы/бейджи */
  align?: 'left' | 'center' | 'right'
  /** Моноширинные цифры (tabular-nums), чтобы суммы не «прыгали» */
  numeric?: boolean
  /** Раскладка iOS-карточки на touch */
  mobileCard?: {
    role?: 'heroEyebrow' | 'heroTitle' | 'heroBadge' | 'heroActions' | 'body' | 'hidden'
    valueVariant?: 'default' | 'primary' | 'amount'
    dividerBefore?: boolean
  }
}

export interface TableProps<T> {
  columns: TableColumn<T>[]
  data: T[]
  loading?: boolean
  onSort?: (key: string, direction: 'asc' | 'desc') => void
  sortKey?: string
  sortDirection?: 'asc' | 'desc'
  rowKey?: (record: T) => string
  rowClassName?: (record: T) => string
  onRowClick?: (record: T) => void
  emptyText?: string
  /** Компактные отступы ячеек */
  dense?: boolean
  /** Дополнительный класс для обёртки .table-wrapper (для скопа стилей) */
  wrapperClassName?: string
  /** Число строк skeleton при loading (list-страницы передают pageSize) */
  skeletonRows?: number
  /** Ключ для кэша числа строк между визитами (например pathname списка) */
  rowCountCacheKey?: string
  /** Touch-карточки: ios — grouped iOS cards (≤1279px), flat — legacy flat cards (≤767px) */
  touchCardLayout?: 'ios' | 'flat'
  /** inset — без page-breakout (модалки, embedded таблицы) */
  touchCardLayoutInset?: boolean
  /** Ref на .table-wrapper (скролл-контейнер в модалках) */
  wrapperRef?: Ref<HTMLDivElement>
}

function TableComponent<T = Record<string, unknown>>({
  columns,
  data,
  loading = false,
  onSort,
  sortKey,
  sortDirection,
  rowKey = (record) => ((record as { id?: string | number }).id as string) || String(record),
  rowClassName,
  onRowClick,
  emptyText = 'Нет данных',
  dense = false,
  wrapperClassName,
  skeletonRows = 5,
  rowCountCacheKey,
  touchCardLayout = 'flat',
  touchCardLayoutInset = false,
  wrapperRef,
}: TableProps<T>) {
  const cachedRowCount = readCachedRowCount(rowCountCacheKey)
  const loadingRowCount = Math.max(
    1,
    Math.min(50, cachedRowCount ?? Math.min(skeletonRows, 10))
  )
  const isLoadingEmpty = loading && data.length === 0
  const listLoadingMinHeight = isLoadingEmpty
    ? resolveListLoadingMinHeight(touchCardLayout, loadingRowCount)
    : undefined
  const wrapperClass = buildWrapperClassName(
    dense,
    touchCardLayout,
    touchCardLayoutInset,
    wrapperClassName
  )
  const wrapperStyle =
    listLoadingMinHeight != null ? { minHeight: listLoadingMinHeight } : undefined
  const iosCards = touchCardLayout === 'ios'
  const iosLayoutVariant = touchCardLayoutInset ? 'inset' : 'page'

  const handleSort = useCallback((key: string) => {
    if (!onSort) return
    const newDirection = sortKey === key && sortDirection === 'asc' ? 'desc' : 'asc'
    onSort(key, newDirection)
  }, [onSort, sortKey, sortDirection])

  useLayoutEffect(() => {
    if (!loading && data.length > 0 && rowCountCacheKey) {
      writeCachedRowCount(rowCountCacheKey, data.length)
    }
  }, [loading, data.length, rowCountCacheKey])

  const renderIosCards = () => (
    <ListIosCardsLayout variant={iosLayoutVariant}>
      {data.map((record, index) => {
        const customClassName = rowClassName ? rowClassName(record) : ''
        const cardProps = buildIosListCardProps(columns, record, index)
        return (
          <IosListCard
            key={rowKey(record)}
            {...cardProps}
            tone={toneFromRowClassName(customClassName)}
            onClick={onRowClick ? () => onRowClick(record) : undefined}
          />
        )
      })}
    </ListIosCardsLayout>
  )

  if (isLoadingEmpty) {
    if (iosCards) {
      return (
        <div className={wrapperClass} style={wrapperStyle} ref={wrapperRef}>
          <ListIosCardsLayout variant={iosLayoutVariant}>
            <IosListCardSkeleton count={Math.min(loadingRowCount, 3)} />
          </ListIosCardsLayout>
        </div>
      )
    }

    return (
      <div
        className={wrapperClass}
        style={wrapperStyle}
        ref={wrapperRef}
      >
        <div className="table-wrapper-inner">
          <table className="table">
            <thead className="table-head">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    scope="col"
                    data-column={column.key}
                    className={`table-header ${column.numeric ? 'table-cell--numeric' : ''}`}
                    style={{
                      width: column.width,
                      textAlign: column.align || 'left',
                    }}
                  >
                    <div className="table-header-content">
                      <span>{column.title}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="table-body">
              {Array.from({ length: loadingRowCount }, (_, rowIndex) => (
                <tr key={rowIndex} className="table-row table-row-skeleton" aria-hidden="true">
                  {columns.map((column) => (
                    <td key={column.key} className="table-cell">
                      <div className="table-skeleton-cell-inline" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  if (data.length === 0) {
    if (iosCards) {
      return (
        <div className={wrapperClass} ref={wrapperRef}>
          <ListIosCardsLayout variant={iosLayoutVariant}>
            <IosListCardEmpty text={emptyText} />
          </ListIosCardsLayout>
        </div>
      )
    }

    return (
      <div className={wrapperClass} ref={wrapperRef}>
        <div className="table-empty">
          <p>{emptyText}</p>
        </div>
      </div>
    )
  }

  const getAriaSort = (key: string): 'ascending' | 'descending' | 'none' => {
    if (sortKey !== key) return 'none'
    return sortDirection === 'asc' ? 'ascending' : 'descending'
  }

  return (
    <div className={wrapperClass} ref={wrapperRef}>
      {/* Inner wrapper clips table to rounded corners */}
      <div className="table-wrapper-inner">
      {/* Desktop/Tablet: Table view */}
      <table className="table">
        <thead className="table-head">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                data-column={column.key}
                className={`table-header ${column.sortable ? 'table-header-sortable' : ''} ${column.numeric ? 'table-cell--numeric' : ''}`}
                style={{
                  width: column.width,
                  textAlign: column.align || 'left',
                }}
                onClick={() => column.sortable && handleSort(column.key)}
                aria-sort={column.sortable ? getAriaSort(column.key) : undefined}
              >
                <div className="table-header-content">
                  <span>{column.title}</span>
                  {column.sortable && (
                    <span className="table-sort-icons">
                      <span
                        className={`table-sort-icon ${
                          sortKey === column.key && sortDirection === 'asc' ? 'table-sort-icon-active' : ''
                        }`}
                      >
                        ↑
                      </span>
                      <span
                        className={`table-sort-icon ${
                          sortKey === column.key && sortDirection === 'desc' ? 'table-sort-icon-active' : ''
                        }`}
                      >
                        ↓
                      </span>
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="table-body">
          {data.map((record, index) => {
            const customClassName = rowClassName ? rowClassName(record) : ''
            return (
            <tr
              key={rowKey(record)}
                className={`table-row ${onRowClick ? 'table-row-clickable' : ''} ${customClassName}`}
              onClick={() => onRowClick?.(record)}
            >
              {columns.map((column) => {
                const cellValue = column.dataIndex ? record[column.dataIndex] : null
                return (
                  <td
                    key={column.key}
                    data-column={column.key}
                    className={`table-cell ${column.numeric ? 'table-cell--numeric' : ''}`}
                    style={{ 
                      width: column.width,
                      textAlign: column.align || 'left' 
                    }}
                  >
                    {column.render
                      ? column.render(cellValue, record, index)
                      : cellValue != null
                      ? String(cellValue)
                      : null}
                  </td>
                )
              })}
            </tr>
            )
          })}
        </tbody>
      </table>
      </div>

      {/* Mobile / touch list: iOS cards or flat cards */}
      {iosCards ? (
        renderIosCards()
      ) : (
      <div className="table-mobile-cards">
        {data.map((record, index) => {
          const customClassName = rowClassName ? rowClassName(record) : ''
          return (
          <div
            key={rowKey(record)}
              className={`table-mobile-card ${onRowClick ? 'table-mobile-card-clickable' : ''} ${customClassName}`}
            onClick={() => onRowClick?.(record)}
          >
            {columns.map((column) => {
              const cellValue = column.dataIndex ? record[column.dataIndex] : null
              const renderedValue = column.render
                ? column.render(cellValue, record, index)
                : cellValue != null
                ? String(cellValue)
                : null

              // Skip empty values on mobile for cleaner cards
              if (renderedValue == null) return null

              return (
                <div key={column.key} className="table-mobile-card-row">
                  <div className="table-mobile-card-label">{column.title}</div>
                  <div className="table-mobile-card-value">{renderedValue}</div>
                </div>
              )
            })}
          </div>
          )
        })}
      </div>
      )}
    </div>
  )
}

// Мемоизация компонента для предотвращения лишних ререндеров
export const Table = memo(TableComponent) as <T = Record<string, unknown>>(
  props: TableProps<T>
) => JSX.Element
