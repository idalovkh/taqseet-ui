import type { ReactNode } from 'react'

/** Поиск и фильтры под KPI/summary-slot на mobile (< 768px). */
export function ListPageToolbarBelowSummary({ children }: { children: ReactNode }) {
  return <div className="list-page-toolbar-below-summary">{children}</div>
}
