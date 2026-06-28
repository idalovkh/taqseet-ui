import type { ReactNode } from 'react'

export type SettingsNoticeVariant = 'info' | 'success' | 'error'

export interface SettingsNoticeProps {
  variant?: SettingsNoticeVariant
  children: ReactNode
}

export function SettingsNotice({ variant = 'info', children }: SettingsNoticeProps) {
  return (
    <div className={`settings-notice settings-notice--${variant}`} role="status">
      {children}
    </div>
  )
}
