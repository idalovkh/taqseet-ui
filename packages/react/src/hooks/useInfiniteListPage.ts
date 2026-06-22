import { useCallback, useEffect, useRef, useState } from 'react'

/** Сбрасывает номер страницы при смене фильтров; увеличивает при подгрузке. */
export function useInfiniteListPage(resetDeps: readonly unknown[]) {
  const [page, setPage] = useState(1)
  const loadLockedRef = useRef(false)

  useEffect(() => {
    setPage(1)
    loadLockedRef.current = false
  }, resetDeps)

  useEffect(() => {
    loadLockedRef.current = false
  }, [page])

  const loadMore = useCallback(() => {
    if (loadLockedRef.current) return
    loadLockedRef.current = true
    setPage((current) => current + 1)
  }, [])

  return {
    page,
    loadMore,
  }
}
