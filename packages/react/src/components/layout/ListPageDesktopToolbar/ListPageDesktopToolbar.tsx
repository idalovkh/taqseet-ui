import type { ReactNode } from 'react'
import './ListPageDesktopToolbar.css'

export interface ListPageDesktopToolbarProps {
  /** Centered control (e.g. calendar month navigation) */
  center?: ReactNode
  search?: ReactNode
  filters?: ReactNode
  secondaryActions?: ReactNode
  primaryAction?: ReactNode
}

export function ListPageDesktopToolbar({
  center,
  search,
  filters,
  secondaryActions,
  primaryAction,
}: ListPageDesktopToolbarProps) {
  const hasSideControls =
    search != null ||
    filters != null ||
    secondaryActions != null ||
    primaryAction != null

  if (!hasSideControls && center == null) {
    return null
  }

  return (
    <div className="list-page-desktop-toolbar">
      {center != null ? (
        <>
          <div className="list-page-desktop-toolbar__spacer" aria-hidden="true" />
          <div className="list-page-desktop-toolbar__center">{center}</div>
          <div className="list-page-desktop-toolbar__spacer" aria-hidden="true" />
        </>
      ) : null}
      {hasSideControls ? (
        <>
          {center == null ? <div className="list-page-desktop-toolbar__spacer" aria-hidden="true" /> : null}
          <div className="list-page-desktop-toolbar__controls">
            {search}
            {filters}
            {secondaryActions}
            {primaryAction}
          </div>
        </>
      ) : null}
    </div>
  )
}
