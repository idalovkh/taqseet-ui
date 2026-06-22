import type { ReactNode } from 'react'
import './ListPageToolbarSearchRow.css'

interface ListPageToolbarSearchRowProps {
  search: ReactNode
  actions?: ReactNode
}

/** Mobile compact toolbar: search field + trailing icon actions (e.g. export). */
export function ListPageToolbarSearchRow({ search, actions }: ListPageToolbarSearchRowProps) {
  return (
    <div className="list-page-toolbar-search-row">
      <div className="list-page-toolbar-search-row__search">{search}</div>
      {actions ? <div className="list-page-toolbar-search-row__actions">{actions}</div> : null}
    </div>
  )
}
