import { useState, useCallback } from 'react'

const DEFAULT_PAGE_SIZE = 20
const VALID_PAGE_SIZES = [10, 20, 50, 100]

interface StoredPagination {
  page: number
  pageSize: number
}

function readStored(storageKey: string, defaultPageSize: number): StoredPagination {
  if (typeof window === 'undefined') {
    return { page: 1, pageSize: defaultPageSize }
  }
  try {
    const raw = window.localStorage.getItem(storageKey)
    if (!raw) return { page: 1, pageSize: defaultPageSize }
    const parsed = JSON.parse(raw) as { page?: number; pageSize?: number }
    const pageSize = VALID_PAGE_SIZES.includes(Number(parsed.pageSize))
      ? Number(parsed.pageSize)
      : defaultPageSize
    const page = Math.max(1, Math.floor(Number(parsed.page) || 1))
    return { page, pageSize }
  } catch {
    return { page: 1, pageSize: defaultPageSize }
  }
}

function writeStored(storageKey: string, page: number, pageSize: number): void {
  try {
    window.localStorage.setItem(storageKey, JSON.stringify({ page, pageSize }))
  } catch {
    // ignore
  }
}

export interface UsePaginationStateOptions {
  /** Ключ localStorage для сохранения page и pageSize. Если не задан — состояние не сохраняется. */
  storageKey?: string
  /** Начальный размер страницы (используется при отсутствии сохранённого значения). */
  defaultPageSize?: number
}

export interface UsePaginationStateResult {
  page: number
  pageSize: number
  setPage: (page: number) => void
  setPageSize: (pageSize: number) => void
}

/**
 * Состояние пагинации с опциональным сохранением page и pageSize в localStorage.
 * При обновлении страницы восстанавливает текущую страницу и размер страницы.
 */
export function usePaginationState(
  options: UsePaginationStateOptions = {}
): UsePaginationStateResult {
  const { storageKey, defaultPageSize = DEFAULT_PAGE_SIZE } = options

  const [state, setState] = useState<StoredPagination>(() => {
    if (storageKey) {
      return readStored(storageKey, defaultPageSize)
    }
    return { page: 1, pageSize: defaultPageSize }
  })

  const setPage = useCallback(
    (page: number) => {
      const value = Math.max(1, Math.floor(page))
      setState((prev) => {
        const next = { ...prev, page: value }
        if (storageKey) writeStored(storageKey, next.page, next.pageSize)
        return next
      })
    },
    [storageKey]
  )

  const setPageSize = useCallback(
    (size: number) => {
      const value = VALID_PAGE_SIZES.includes(size) ? size : DEFAULT_PAGE_SIZE
      setState((prev) => {
        const next = { ...prev, pageSize: value }
        if (storageKey) writeStored(storageKey, next.page, next.pageSize)
        return next
      })
    },
    [storageKey]
  )

  return {
    page: state.page,
    pageSize: state.pageSize,
    setPage,
    setPageSize,
  }
}
