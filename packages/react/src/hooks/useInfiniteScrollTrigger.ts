import { useContext, useLayoutEffect, useRef, type RefObject } from 'react'
import { ScrollRestorationContext } from '@/shared/contexts/ScrollRestorationContext'

interface UseInfiniteScrollTriggerOptions {
  enabled: boolean
  hasMore: boolean
  isLoading: boolean
  isLoadingMore: boolean
  onLoadMore: () => void
  rootMargin?: string
  /** Scroll container for intersection (e.g. modal list). Defaults to .app-layout-main. */
  scrollRootRef?: RefObject<HTMLElement | null>
}

/**
 * IntersectionObserver у нижнего края списка — подгрузка следующей страницы.
 */
export function useInfiniteScrollTrigger({
  enabled,
  hasMore,
  isLoading,
  isLoadingMore,
  onLoadMore,
  rootMargin = '240px',
  scrollRootRef,
}: UseInfiniteScrollTriggerOptions) {
  const scrollRestorationCtx = useContext(ScrollRestorationContext)
  const resolvedScrollRootRef = scrollRootRef ?? scrollRestorationCtx?.mainRef
  const sentinelRef = useRef<HTMLDivElement>(null)
  const onLoadMoreRef = useRef(onLoadMore)
  onLoadMoreRef.current = onLoadMore

  const stateRef = useRef({ isLoading, isLoadingMore, hasMore, enabled })
  stateRef.current = { isLoading, isLoadingMore, hasMore, enabled }

  useLayoutEffect(() => {
    const el = sentinelRef.current
    if (!el) return

    const root = resolvedScrollRootRef?.current ?? null

    const observer = new IntersectionObserver(
      (entries) => {
        const state = stateRef.current
        if (!state.enabled || !state.hasMore || state.isLoading || state.isLoadingMore) return
        if (!entries[0]?.isIntersecting) return
        onLoadMoreRef.current()
      },
      { root, rootMargin, threshold: 0 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [rootMargin, hasMore, enabled, isLoading, isLoadingMore, resolvedScrollRootRef])

  return sentinelRef as RefObject<HTMLDivElement>
}
