import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export interface SettingsBackLink {
  to: string
  label: string
}

export interface SettingsPageFrameProps {
  title: string
  titleIcon?: ReactNode
  subtitle?: string
  backLink?: SettingsBackLink
  summary?: ReactNode
  toolbar?: ReactNode
  children: ReactNode
  className?: string
}

export function SettingsPageFrame({
  title,
  titleIcon,
  subtitle,
  backLink,
  summary,
  toolbar,
  children,
  className = '',
}: SettingsPageFrameProps) {
  return (
    <div className={`settings-page-frame ${className}`.trim()}>
      <header
        className={`settings-page-frame__header${
          backLink ? ' settings-page-frame__header--with-back' : ''
        }`}
      >
        <div className="settings-page-frame__title-row">
          {backLink ? (
            <Link
              to={backLink.to}
              className="menu-back-link settings-page-frame__back"
              aria-label={backLink.label}
            >
              <ArrowLeft size={18} strokeWidth={1.75} aria-hidden />
            </Link>
          ) : null}
          {titleIcon ? (
            <span className="settings-page-frame__title-icon" aria-hidden="true">
              {titleIcon}
            </span>
          ) : null}
          <h2 className="settings-page-frame__title">{title}</h2>
        </div>
        {subtitle ? <p className="settings-page-frame__subtitle">{subtitle}</p> : null}
      </header>

      {toolbar ? <div className="settings-page-frame__toolbar">{toolbar}</div> : null}
      {summary ? <div className="settings-page-frame__summary">{summary}</div> : null}

      <div className="settings-page-frame__body">{children}</div>
    </div>
  )
}
