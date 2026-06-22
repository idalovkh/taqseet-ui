import { useState, useEffect } from 'react'
import { MEDIA_DESKTOP, MEDIA_MOBILE, MEDIA_TABLET } from '@/shared/constants/breakpoints'

export interface Breakpoints {
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
}

function readBreakpoints(): Breakpoints {
  if (typeof window === 'undefined') {
    return { isMobile: false, isTablet: false, isDesktop: true }
  }

  return {
    isMobile: window.matchMedia(MEDIA_MOBILE).matches,
    isTablet: window.matchMedia(MEDIA_TABLET).matches,
    isDesktop: window.matchMedia(MEDIA_DESKTOP).matches,
  }
}

export const useBreakpoint = (): Breakpoints => {
  const [breakpoints, setBreakpoints] = useState<Breakpoints>(readBreakpoints)

  useEffect(() => {
    const mobileQuery = window.matchMedia(MEDIA_MOBILE)
    const tabletQuery = window.matchMedia(MEDIA_TABLET)
    const desktopQuery = window.matchMedia(MEDIA_DESKTOP)

    const sync = () => setBreakpoints(readBreakpoints())

    sync()
    mobileQuery.addEventListener('change', sync)
    tabletQuery.addEventListener('change', sync)
    desktopQuery.addEventListener('change', sync)

    return () => {
      mobileQuery.removeEventListener('change', sync)
      tabletQuery.removeEventListener('change', sync)
      desktopQuery.removeEventListener('change', sync)
    }
  }, [])

  return breakpoints
}
