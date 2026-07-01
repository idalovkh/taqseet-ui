import type { ReactNode } from 'react'

export interface AppShellBrand {
  icon?: ReactNode
  text: string
  ariaLabel?: string
  onClick?: () => void
}

export interface AppShellHeaderAction {
  key: string
  icon: ReactNode
  ariaLabel: string
  to?: string
  onClick?: () => void
  active?: boolean
}

export interface AppShellSubNavItem {
  key?: string
  path: string
  label: string
}

export interface AppShellNavItem {
  key?: string
  path?: string
  label: string
  icon: ReactNode
  children?: AppShellSubNavItem[]
  dividerBefore?: boolean
  isActive?: (pathname: string) => boolean
}
