import { useBreakpoint } from '@/shared/hooks/useBreakpoint'

/** Compact list layout: mobile + tablet (viewport under 1280px). */
export function useListPageCompactLayout() {
  const { isDesktop } = useBreakpoint()
  return { isCompactLayout: !isDesktop }
}
