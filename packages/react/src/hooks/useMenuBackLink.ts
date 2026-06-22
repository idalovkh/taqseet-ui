import { useLocation } from 'react-router-dom'
import type { ListPageBackLink } from '@/shared/components/layout/ListPageLayout/ListPageLayout'
import { isMenuChildRoute, MENU_BACK_LINK } from '@/shared/config/menuBackNavigation'
import { useListPageCompactLayout } from '@/shared/hooks/useListPageCompactLayout'

export function useMenuBackLink(): ListPageBackLink | undefined {
  const { pathname } = useLocation()
  const { isCompactLayout } = useListPageCompactLayout()

  if (!isCompactLayout || !isMenuChildRoute(pathname)) {
    return undefined
  }

  return MENU_BACK_LINK
}
