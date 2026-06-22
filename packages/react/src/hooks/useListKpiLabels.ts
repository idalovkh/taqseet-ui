import { useListPageCompactLayout } from '@/shared/hooks/useListPageCompactLayout'

/** Pick short label on compact (mobile + tablet) or full on desktop. */
export function useListKpiLabels() {
  const { isCompactLayout } = useListPageCompactLayout()
  return {
    isCompactLayout,
    label: (full: string, short: string) => (isCompactLayout ? short : full),
  }
}
