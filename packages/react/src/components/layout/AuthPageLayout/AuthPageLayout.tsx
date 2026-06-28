import type { ReactNode } from 'react'

export interface AuthPageLayoutProps {
  logoText: string
  title: string
  subtitle?: string
  footer?: ReactNode
  children: ReactNode
  variant?: 'scroll' | 'centered'
  className?: string
}

export function AuthPageLayout({
  logoText,
  title,
  subtitle,
  footer,
  children,
  variant = 'scroll',
  className = '',
}: AuthPageLayoutProps) {
  return (
    <div className={`auth-page auth-page--${variant} ${className}`.trim()}>
      <div className="auth-page__background" aria-hidden="true" />

      <div className="auth-page__container">
        <div className="auth-page__brand">
          <div className="auth-page__logo">
            <span className="auth-page__logo-text">{logoText}</span>
          </div>
          <h2 className="auth-page__title">{title}</h2>
          {subtitle ? <p className="auth-page__subtitle">{subtitle}</p> : null}
        </div>

        <div className="auth-page__card">{children}</div>

        {footer ? <div className="auth-page__footer">{footer}</div> : null}
      </div>
    </div>
  )
}
