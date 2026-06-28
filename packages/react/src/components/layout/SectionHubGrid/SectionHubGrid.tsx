import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import './SectionHubGrid.css'

export interface SectionHubItem {
  id: string
  label: string
  description: string
  path: string
  icon: LucideIcon
}

export interface SectionHubGridProps {
  items: SectionHubItem[]
  emptyMessage?: ReactNode
  onPrefetch?: (path: string) => void
}

export function SectionHubGrid({
  items,
  emptyMessage = 'Нет доступных разделов для вашей роли.',
  onPrefetch,
}: SectionHubGridProps) {
  if (items.length === 0) {
    return <p className="section-hub__empty">{emptyMessage}</p>
  }

  return (
    <div className="section-hub__grid">
      {items.map((item) => {
        const Icon = item.icon
        return (
          <Link
            key={item.id}
            to={item.path}
            className="section-hub-card"
            onMouseEnter={onPrefetch ? () => onPrefetch(item.path) : undefined}
            onFocus={onPrefetch ? () => onPrefetch(item.path) : undefined}
          >
            <div className="section-hub-card__head">
              <Icon size={18} strokeWidth={1.75} className="section-hub-card__icon" aria-hidden />
              <h2 className="section-hub-card__title">{item.label}</h2>
              <ArrowUpRight size={16} strokeWidth={1.75} className="section-hub-card__arrow" aria-hidden />
            </div>
            <p className="section-hub-card__description">{item.description}</p>
          </Link>
        )
      })}
    </div>
  )
}
