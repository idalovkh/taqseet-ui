import './Pagination.css'

interface PaginationProps {
  current: number
  total: number
  pageSize: number
  onChange: (page: number) => void
  onPageSizeChange?: (pageSize: number) => void
  showSizeChanger?: boolean
  pageSizeOptions?: number[]
}

export const Pagination = ({
  current,
  total,
  pageSize,
  onChange,
  onPageSizeChange,
  showSizeChanger = true,
  pageSizeOptions = [10, 20, 50, 100],
}: PaginationProps) => {
  const totalPages = total > 0 ? Math.ceil(total / pageSize) : 0

  const handlePageSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(Number(e.target.value))
  }

  const handlePageSizeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onPageSizeChange?.(Number(e.target.value))
  }

  return (
    <div className="pagination">
      <div className="pagination-info">
        <span>Всего: {total}</span>
      </div>
      <div className="pagination-controls">
        {totalPages > 1 ? (
          <label className="pagination-page-nav">
            <span className="pagination-page-nav-label">Страница</span>
            <select
              className="pagination-page-select"
              value={current}
              onChange={handlePageSelect}
              aria-label="Номер страницы"
            >
              {Array.from({ length: totalPages }, (_, index) => {
                const page = index + 1
                return (
                  <option key={page} value={page}>
                    {page}
                  </option>
                )
              })}
            </select>
            <span className="pagination-page-nav-total">из {totalPages}</span>
          </label>
        ) : total > 0 ? (
          <span className="pagination-page-static">Страница 1</span>
        ) : null}
        {showSizeChanger && onPageSizeChange ? (
          <select
            className="pagination-page-size"
            value={pageSize}
            onChange={handlePageSizeSelect}
            aria-label="Записей на странице"
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}/стр.
              </option>
            ))}
          </select>
        ) : null}
      </div>
    </div>
  )
}
