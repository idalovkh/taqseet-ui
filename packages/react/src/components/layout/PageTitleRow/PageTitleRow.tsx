import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import '@/shared/components/layout/MenuBackLink/MenuBackLink.css'
import '@/shared/components/layout/ListPageLayout/ListPageLayout.css'
import './PageTitleRow.css'

type PageTitleRowBackAction =
  | { type: 'button'; onClick: () => void; ariaLabel: string }
  | { type: 'link'; to: string; ariaLabel: string }

export interface PageTitleRowProps {
  title: string
  titleIcon?: ReactNode
  subtitle?: string
  backAction: PageTitleRowBackAction
  titleTag?: 'h1' | 'h2'
  className?: string
}

export function PageTitleRow({
  title,
  titleIcon,
  subtitle,
  backAction,
  titleTag: TitleTag = 'h1',
  className = '',
}: PageTitleRowProps) {
  const backButton = (
    <>
      <ArrowLeft size={18} strokeWidth={1.75} aria-hidden />
    </>
  )

  return (
    <div className={`page-title-row list-page-header list-page-header--with-back ${className}`.trim()}>
      <div className="list-page-title-row">
        {backAction.type === 'button' ? (
          <button
            type="button"
            className="menu-back-link list-page-menu-back"
            onClick={backAction.onClick}
            aria-label={backAction.ariaLabel}
          >
            {backButton}
          </button>
        ) : (
          <Link
            to={backAction.to}
            className="menu-back-link list-page-menu-back"
            aria-label={backAction.ariaLabel}
          >
            {backButton}
          </Link>
        )}
        {titleIcon ? (
          <span className="list-page-title-icon" aria-hidden="true">
            {titleIcon}
          </span>
        ) : null}
        <TitleTag className="list-page-title">{title}</TitleTag>
      </div>
      {subtitle ? <p className="list-page-subtitle">{subtitle}</p> : null}
    </div>
  )
}
