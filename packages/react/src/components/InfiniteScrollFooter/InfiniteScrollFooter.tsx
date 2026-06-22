import type { Ref } from 'react'
import './InfiniteScrollFooter.css'

interface InfiniteScrollFooterProps {
  sentinelRef: Ref<HTMLDivElement>
  isLoadingMore: boolean
  hasMore: boolean
  loadedCount: number
  totalCount: number
}

export function InfiniteScrollFooter({
  sentinelRef,
  isLoadingMore,
  hasMore,
  loadedCount,
  totalCount,
}: InfiniteScrollFooterProps) {
  const showEnd = !hasMore && totalCount > 0 && !isLoadingMore

  return (
    <div className="infinite-scroll-footer" aria-live="polite">
      <div ref={sentinelRef} className="infinite-scroll-footer__sentinel" aria-hidden />
      {isLoadingMore ? (
        <p className="infinite-scroll-footer__status">Загрузка…</p>
      ) : showEnd ? (
        <p className="infinite-scroll-footer__status">
          {loadedCount >= totalCount
            ? `Показаны все ${totalCount}`
            : `Показано ${loadedCount} из ${totalCount}`}
        </p>
      ) : null}
    </div>
  )
}
