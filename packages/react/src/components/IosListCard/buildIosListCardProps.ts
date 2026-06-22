import type { ReactNode } from 'react'
import type { TableColumn } from '@/shared/components/ui/Table'
import type { IosListCardProps, IosListCardRowData } from './IosListCard'

export type MobileCardRole = 'heroEyebrow' | 'heroTitle' | 'heroBadge' | 'heroActions' | 'body' | 'hidden'

const HERO_EYEBROW_KEYS = new Set(['displayNumber', 'number', 'agreementNumber'])
const HERO_BADGE_KEYS = new Set(['status'])

function inferMobileCardRole<T>(column: TableColumn<T>): MobileCardRole | 'unset' {
  const explicit = column.mobileCard?.role
  if (explicit) return explicit
  if (column.key === 'actions') return 'hidden'
  if (HERO_BADGE_KEYS.has(column.key)) return 'heroBadge'
  if (HERO_EYEBROW_KEYS.has(column.key)) return 'heroEyebrow'
  return 'unset'
}

function renderColumnValue<T>(
  column: TableColumn<T>,
  record: T,
  index: number
): ReactNode | null {
  const cellValue = column.dataIndex ? record[column.dataIndex] : null
  const rendered = column.render
    ? column.render(cellValue, record, index)
    : cellValue != null
      ? String(cellValue)
      : null
  return rendered ?? null
}

export function buildIosListCardProps<T>(
  columns: TableColumn<T>[],
  record: T,
  index: number
): Omit<IosListCardProps, 'onClick' | 'className' | 'tone'> {
  type ResolvedColumn = {
    column: TableColumn<T>
    role: MobileCardRole
    value: ReactNode
  }

  const resolved: ResolvedColumn[] = []

  for (const column of columns) {
    const inferred = inferMobileCardRole(column)
    if (inferred === 'hidden') continue

    const value = renderColumnValue(column, record, index)
    if (value == null) continue

    resolved.push({
      column,
      role: inferred === 'unset' ? 'body' : inferred,
      value,
    })
  }

  let heroTitleIndex = resolved.findIndex((item) => item.role === 'heroTitle')
  if (heroTitleIndex < 0) {
    const firstBodyIndex = resolved.findIndex((item) => item.role === 'body')
    if (firstBodyIndex >= 0) {
      resolved[firstBodyIndex] = { ...resolved[firstBodyIndex], role: 'heroTitle' }
      heroTitleIndex = firstBodyIndex
    }
  }

  const eyebrowItem = resolved.find((item) => item.role === 'heroEyebrow')
  const badgeItem = resolved.find((item) => item.role === 'heroBadge')
  const actionsItem = resolved.find((item) => item.role === 'heroActions')
  const titleItem = resolved.find((item) => item.role === 'heroTitle')

  const rows: IosListCardRowData[] = resolved
    .filter((item) => item.role === 'body')
    .map((item) => ({
      label: item.column.title,
      value: item.value,
      valueVariant: item.column.mobileCard?.valueVariant,
      dividerBefore: item.column.mobileCard?.dividerBefore,
    }))

  return {
    eyebrow: eyebrowItem?.value,
    title: titleItem?.value ?? '—',
    badge: badgeItem?.value,
    actions: actionsItem?.value,
    rows,
  }
}

