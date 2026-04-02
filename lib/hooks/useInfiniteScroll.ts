import { useEffect, useRef } from 'react'

interface UseInfiniteScrollOptions {
  hasMore: boolean
  isLoadingMore: boolean
  fetchNextPage: () => void
  scrollContainerRef?: React.RefObject<HTMLElement | null>
  rootMargin?: string
}

export const useInfiniteScroll = ({
  hasMore,
  isLoadingMore,
  fetchNextPage,
  scrollContainerRef,
  rootMargin = '0px 0px 50px 0px',
}: UseInfiniteScrollOptions) => {
  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const root = scrollContainerRef?.current ?? null

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasMore && !isLoadingMore) {
          fetchNextPage()
        }
      },
      { root, threshold: 0, rootMargin }
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [hasMore, isLoadingMore, fetchNextPage, scrollContainerRef, rootMargin])

  return { sentinelRef }
}
