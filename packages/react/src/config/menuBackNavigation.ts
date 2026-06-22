import type { ListPageBackLink } from '@/shared/components/layout/ListPageLayout/ListPageLayout'

export interface MenuBackNavigationConfig {
  menuBackLink: ListPageBackLink
  nonMenuRoutePrefixes: readonly string[]
}

const defaultConfig: MenuBackNavigationConfig = {
  menuBackLink: {
    to: '/menu',
    label: 'Меню',
  },
  nonMenuRoutePrefixes: [
    '/menu',
    '/',
    '/login',
    '/register-company',
    '/auth',
    '/agreements',
    '/finance',
    '/dashboard',
    '/calendar',
    '/overview',
  ],
}

let menuBackNavigationConfig: MenuBackNavigationConfig = defaultConfig

export function configureMenuBackNavigation(config: MenuBackNavigationConfig): void {
  menuBackNavigationConfig = config
}

export function getMenuBackNavigationConfig(): MenuBackNavigationConfig {
  return menuBackNavigationConfig
}

export const MENU_BACK_LINK: ListPageBackLink = new Proxy({} as ListPageBackLink, {
  get(_target, prop) {
    return menuBackNavigationConfig.menuBackLink[prop as keyof ListPageBackLink]
  },
})

export function isMenuChildRoute(pathname: string): boolean {
  return !menuBackNavigationConfig.nonMenuRoutePrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  )
}
