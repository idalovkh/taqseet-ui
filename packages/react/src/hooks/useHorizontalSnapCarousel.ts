import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'

const GESTURE_LOCK_THRESHOLD_PX = 8
const COARSE_SCROLL_DEBOUNCE_MS = 60

function getPageWidth(scroller: HTMLDivElement): number {
  return Math.floor(scroller.clientWidth)
}

function getSlides(scroller: HTMLDivElement, slideSelector: string): HTMLElement[] {
  return Array.from(scroller.querySelectorAll<HTMLElement>(slideSelector))
}

function getSlideScrollLeft(scroller: HTMLDivElement, slide: HTMLElement): number {
  const scrollerRect = scroller.getBoundingClientRect()
  const slideRect = slide.getBoundingClientRect()
  return scroller.scrollLeft + (slideRect.left - scrollerRect.left)
}

function readScrollTargetForIndex(
  scroller: HTMLDivElement,
  slideSelector: string,
  index: number
): number {
  const slides = getSlides(scroller, slideSelector)
  const clampedIndex = Math.min(Math.max(index, 0), Math.max(slides.length - 1, 0))
  const targetSlide = slides[clampedIndex]
  if (!targetSlide) {
    return clampedIndex * getPageWidth(scroller)
  }

  return getSlideScrollLeft(scroller, targetSlide)
}

function readActiveIndex(scroller: HTMLDivElement, slideSelector: string, itemCount: number): number {
  const pageWidth = getPageWidth(scroller)
  if (pageWidth <= 0 || itemCount === 0) return 0

  const slides = scroller.querySelectorAll<HTMLElement>(slideSelector)
  if (slides.length === 0) {
    return Math.min(Math.max(Math.round(scroller.scrollLeft / pageWidth), 0), itemCount - 1)
  }

  const scrollerRect = scroller.getBoundingClientRect()
  const scrollerCenter = scrollerRect.left + scrollerRect.width / 2

  let bestIndex = 0
  let bestDistance = Number.POSITIVE_INFINITY

  slides.forEach((slide, index) => {
    const slideRect = slide.getBoundingClientRect()
    const slideCenter = slideRect.left + slideRect.width / 2
    const distance = Math.abs(slideCenter - scrollerCenter)
    if (distance < bestDistance) {
      bestDistance = distance
      bestIndex = index
    }
  })

  return Math.min(Math.max(bestIndex, 0), itemCount - 1)
}

function isCoarsePointer(): boolean {
  return window.matchMedia('(hover: none) and (pointer: coarse)').matches
}

interface UseHorizontalSnapCarouselOptions {
  itemCount: number
  initialIndex: number
  slideSelector: string
  /** Различает вертикальный скролл страницы и горизонтальный свайп карусели на touch */
  gestureAxisLock?: boolean
}

export function useHorizontalSnapCarousel({
  itemCount,
  initialIndex,
  slideSelector,
  gestureAxisLock = false,
}: UseHorizontalSnapCarouselOptions) {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(initialIndex)
  const initialScrollDone = useRef(false)
  const isTouchingRef = useRef(false)
  const activeIndexRef = useRef(activeIndex)
  activeIndexRef.current = activeIndex

  const updateActiveIndex = useCallback(
    (nextIndex: number) => {
      const clamped = Math.min(Math.max(nextIndex, 0), Math.max(itemCount - 1, 0))
      if (activeIndexRef.current === clamped) return
      setActiveIndex(clamped)
    },
    [itemCount]
  )

  const scrollToIndex = useCallback(
    (index: number, behavior: ScrollBehavior = 'smooth') => {
      const scroller = scrollerRef.current
      if (!scroller) return false
      const left = readScrollTargetForIndex(scroller, slideSelector, index)
      scroller.scrollTo({ left, behavior })
      updateActiveIndex(index)
      return true
    },
    [slideSelector, updateActiveIndex]
  )

  const tryInitialScroll = useCallback(() => {
    if (initialScrollDone.current || itemCount === 0) return false
    const scroller = scrollerRef.current
    if (!scroller) return false

    const didScroll = scrollToIndex(initialIndex, 'instant')
    const canScroll = itemCount <= 1 || scroller.scrollWidth > scroller.clientWidth

    if (didScroll && canScroll) {
      initialScrollDone.current = true
    }
    return didScroll && canScroll
  }, [initialIndex, itemCount, scrollToIndex, slideSelector])

  useLayoutEffect(() => {
    initialScrollDone.current = false
    setActiveIndex(initialIndex)

    if (itemCount === 0) return
    const scroller = scrollerRef.current
    if (!scroller) return

    let cancelled = false
    let attempts = 0
    const maxAttempts = 24

    const attempt = () => {
      if (cancelled || initialScrollDone.current) return
      if (tryInitialScroll()) return
      attempts += 1
      if (attempts < maxAttempts) {
        requestAnimationFrame(attempt)
      }
    }

    requestAnimationFrame(attempt)

    const resizeObserver = new ResizeObserver(() => {
      if (isTouchingRef.current) return

      tryInitialScroll()
      if (initialScrollDone.current) {
        const left = readScrollTargetForIndex(scroller, slideSelector, activeIndexRef.current)
        scroller.scrollTo({
          left,
          behavior: 'instant',
        })
      }
    })
    resizeObserver.observe(scroller)

    return () => {
      cancelled = true
      resizeObserver.disconnect()
    }
  }, [initialIndex, itemCount, tryInitialScroll, slideSelector])

  useEffect(() => {
    const scroller = scrollerRef.current
    if (!scroller || itemCount === 0) return

    const coarsePointer = isCoarsePointer()
    let frame = 0
    let scrollDebounceTimer = 0

    const finalizeScroll = () => {
      const index = readActiveIndex(scroller, slideSelector, itemCount)
      updateActiveIndex(index)
      const left = readScrollTargetForIndex(scroller, slideSelector, index)
      scroller.scrollTo({ left, behavior: 'instant' })
    }

    const syncFromScroll = () => {
      if (coarsePointer) {
        window.clearTimeout(scrollDebounceTimer)
        scrollDebounceTimer = window.setTimeout(finalizeScroll, COARSE_SCROLL_DEBOUNCE_MS)
        return
      }

      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        updateActiveIndex(readActiveIndex(scroller, slideSelector, itemCount))
      })
    }

    const onResize = () => {
      if (!initialScrollDone.current || isTouchingRef.current) return
      const left = readScrollTargetForIndex(scroller, slideSelector, activeIndexRef.current)
      scroller.scrollTo({ left, behavior: 'instant' })
    }

    const markTouchStart = () => {
      isTouchingRef.current = true
    }

    const markTouchEnd = () => {
      isTouchingRef.current = false
    }

    scroller.addEventListener('scroll', syncFromScroll, { passive: true })
    scroller.addEventListener('scrollend', finalizeScroll, { passive: true })
    scroller.addEventListener('touchstart', markTouchStart, { passive: true })
    scroller.addEventListener('touchend', markTouchEnd, { passive: true })
    scroller.addEventListener('touchcancel', markTouchEnd, { passive: true })
    window.addEventListener('resize', onResize)

    let gestureStartX = 0
    let gestureStartY = 0
    let gestureLocked: 'x' | 'y' | null = null

    const resetGestureLock = () => {
      gestureLocked = null
      scroller.style.touchAction = 'manipulation'
    }

    const onGestureStart = (event: TouchEvent) => {
      const touch = event.touches[0]
      if (!touch) return
      gestureStartX = touch.clientX
      gestureStartY = touch.clientY
      resetGestureLock()
    }

    const onGestureMove = (event: TouchEvent) => {
      if (!gestureAxisLock || gestureLocked) return

      const touch = event.touches[0]
      if (!touch) return

      const dx = Math.abs(touch.clientX - gestureStartX)
      const dy = Math.abs(touch.clientY - gestureStartY)
      if (dx < GESTURE_LOCK_THRESHOLD_PX && dy < GESTURE_LOCK_THRESHOLD_PX) return

      gestureLocked = dx > dy ? 'x' : 'y'
      scroller.style.touchAction = gestureLocked === 'x' ? 'pan-x' : 'pan-y'
    }

    if (gestureAxisLock) {
      scroller.style.touchAction = 'manipulation'
      scroller.addEventListener('touchstart', onGestureStart, { passive: true })
      scroller.addEventListener('touchmove', onGestureMove, { passive: true })
      scroller.addEventListener('touchend', resetGestureLock, { passive: true })
      scroller.addEventListener('touchcancel', resetGestureLock, { passive: true })
    }

    const slides = scroller.querySelectorAll<HTMLElement>(slideSelector)
    const observerThresholds = coarsePointer ? [0.5, 0.75, 1] : [0.35, 0.5, 0.65, 0.8, 1]
    const observer =
      slides.length > 0
        ? new IntersectionObserver(
            () => {
              syncFromScroll()
            },
            {
              root: scroller,
              threshold: observerThresholds,
            }
          )
        : null

    slides.forEach((slide) => observer?.observe(slide))

    if (!coarsePointer) {
      syncFromScroll()
    }

    return () => {
      cancelAnimationFrame(frame)
      window.clearTimeout(scrollDebounceTimer)
      scroller.removeEventListener('scroll', syncFromScroll)
      scroller.removeEventListener('scrollend', finalizeScroll)
      scroller.removeEventListener('touchstart', markTouchStart)
      scroller.removeEventListener('touchend', markTouchEnd)
      scroller.removeEventListener('touchcancel', markTouchEnd)
      window.removeEventListener('resize', onResize)
      if (gestureAxisLock) {
        scroller.removeEventListener('touchstart', onGestureStart)
        scroller.removeEventListener('touchmove', onGestureMove)
        scroller.removeEventListener('touchend', resetGestureLock)
        scroller.removeEventListener('touchcancel', resetGestureLock)
        scroller.style.touchAction = ''
      }
      observer?.disconnect()
    }
  }, [gestureAxisLock, itemCount, slideSelector, updateActiveIndex])

  return { scrollerRef, activeIndex, scrollToIndex }
}
