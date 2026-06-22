import type { Ref } from 'react'
import { InfiniteScrollFooter } from '@/shared/components/ui/InfiniteScrollFooter/InfiniteScrollFooter'

interface ListScrollFooterProps {
  total: number
  isLoadingMore: boolean
  hasMore: boolean
  loadedCount: number
  sentinelRef: Ref<HTMLDivElement>
}

export function ListScrollFooter({
  total,
  isLoadingMore,
  hasMore,
  loadedCount,
  sentinelRef,
}: ListScrollFooterProps) {
  if (total <= 0) return null

  return (
    <InfiniteScrollFooter
      sentinelRef={sentinelRef}
      isLoadingMore={isLoadingMore}
      hasMore={hasMore}
      loadedCount={loadedCount}
      totalCount={total}
    />
  )
}
