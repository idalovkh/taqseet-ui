import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { PageContent, type PageContentVariant } from '@/shared/components/layout/PageContent'
import { MenuBackLink } from '@/shared/components/layout/MenuBackLink'
import { ListPageToolbarBelowSummary } from '@/shared/components/layout/ListPageToolbarBelowSummary/ListPageToolbarBelowSummary'
import {
  ListPageDesktopToolbar,
  type ListPageDesktopToolbarProps,
} from '@/shared/components/layout/ListPageDesktopToolbar'
import { useListPageCompactLayout } from '@/shared/hooks/useListPageCompactLayout'
import { useMenuBackLink } from '@/shared/hooks/useMenuBackLink'
import './ListPageLayout.css'

export interface ListPageBackLink {
  to: string
  label: string
}

export interface ListPageLayoutProps {
  title: string
  /** Иконка слева от H1 (lucide или nav icon) */
  titleIcon?: ReactNode
  subtitle?: string
  backLink?: ListPageBackLink
  pageClassName: string
  contentVariant?: PageContentVariant
  summary?: ReactNode
  headerAddon?: ReactNode
  /** Панель под заголовком (обычно фильтры), выравнивается вправо */
  headerToolbar?: ReactNode
  /** Trailing actions в строке заголовка (mobile compact layout) */
  titleTrailingActions?: ReactNode
  /** @deprecated On desktop use `desktopToolbarSlots.secondaryActions` */
  stickyActions?: ReactNode
  /** @deprecated Use `desktopToolbarSlots` */
  desktopToolbar?: ReactNode
  desktopToolbarSlots?: ListPageDesktopToolbarProps
  compactToolbar?: ReactNode
  children: ReactNode
  scrollFooter?: ReactNode
  floatingAction?: ReactNode
  /** Внутри settings-shell: без PageContent, H2 вместо H1, без backLink */
  embedded?: boolean
}

export function ListPageLayout({
  title,
  titleIcon,
  subtitle,
  backLink,
  pageClassName,
  contentVariant = 'default',
  summary,
  headerAddon,
  headerToolbar,
  titleTrailingActions,
  stickyActions,
  desktopToolbar,
  desktopToolbarSlots,
  compactToolbar,
  children,
  scrollFooter,
  floatingAction,
  embedded = false,
}: ListPageLayoutProps) {
  const { isCompactLayout } = useListPageCompactLayout()
  const menuBackLink = useMenuBackLink()
  const resolvedBackLink = embedded ? undefined : backLink

  const desktopToolbarNode = !isCompactLayout
    ? desktopToolbarSlots
      ? (
          <ListPageDesktopToolbar
            center={desktopToolbarSlots.center}
            search={desktopToolbarSlots.search}
            filters={desktopToolbarSlots.filters}
            secondaryActions={desktopToolbarSlots.secondaryActions ?? stickyActions}
            primaryAction={desktopToolbarSlots.primaryAction}
          />
        )
      : desktopToolbar || stickyActions
        ? (
            <ListPageDesktopToolbar
              search={desktopToolbar}
              secondaryActions={stickyActions}
            />
          )
        : null
    : null

  const pageClasses = ['list-page', pageClassName, embedded ? 'list-page--embedded' : '']
    .filter(Boolean)
    .join(' ')

  const TitleTag = embedded ? 'h2' : 'h1'

  const content = (
    <>
      {headerAddon}

      {!menuBackLink && resolvedBackLink ? (
        <Link to={resolvedBackLink.to} className="list-page-back">
          <ArrowLeft size={16} aria-hidden />
          <span>{resolvedBackLink.label}</span>
        </Link>
      ) : null}

      <div className={`list-page-header${menuBackLink ? ' list-page-header--with-back' : ''}`}>
        <div className="list-page-title-row">
          {menuBackLink ? <MenuBackLink className="list-page-menu-back" /> : null}
          {titleIcon ? (
            <span className="list-page-title-icon" aria-hidden="true">
              {titleIcon}
            </span>
          ) : null}
          <TitleTag className="list-page-title">{title}</TitleTag>
          {isCompactLayout && titleTrailingActions ? (
            <div className="list-page-title-row__trailing">{titleTrailingActions}</div>
          ) : null}
        </div>
        {subtitle ? <p className="list-page-subtitle">{subtitle}</p> : null}
        {headerToolbar ? (
          <div className="list-page-header-toolbar">{headerToolbar}</div>
        ) : null}
      </div>

      {isCompactLayout && stickyActions ? (
        <div className="list-page-sticky-actions">{stickyActions}</div>
      ) : null}

      {desktopToolbarNode}

      {isCompactLayout && compactToolbar ? (
        <ListPageToolbarBelowSummary>{compactToolbar}</ListPageToolbarBelowSummary>
      ) : null}

      {summary ? <div className="list-page-summary">{summary}</div> : null}

      <div className="list-page-body">{children}</div>

      {scrollFooter ? <div className="list-page-scroll-footer">{scrollFooter}</div> : null}

      {isCompactLayout ? floatingAction : null}
    </>
  )

  if (embedded) {
    return <div className={pageClasses}>{content}</div>
  }

  return (
    <PageContent variant={contentVariant} className={pageClasses} menuBack="hide">
      {content}
    </PageContent>
  )
}
