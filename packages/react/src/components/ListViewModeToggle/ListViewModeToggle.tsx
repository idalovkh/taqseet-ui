import { LayoutGrid, Table2 } from 'lucide-react'
import './ListViewModeToggle.css'

export type ListViewMode = 'table' | 'cards'

interface ListViewModeToggleProps {
  mode: ListViewMode
  onChange: (mode: ListViewMode) => void
  className?: string
}

export function ListViewModeToggle({ mode, onChange, className }: ListViewModeToggleProps) {
  return (
    <div
      className={['list-view-mode-toggle', className].filter(Boolean).join(' ')}
      role="group"
      aria-label="List display mode"
      data-mode={mode}
    >
      <button
        type="button"
        className="list-view-mode-toggle__button"
        aria-label="Show as table"
        title="Show as table"
        aria-pressed={mode === 'table'}
        data-active={mode === 'table' ? 'true' : undefined}
        onClick={() => onChange('table')}
      >
        <Table2 size={17} />
      </button>
      <button
        type="button"
        className="list-view-mode-toggle__button"
        aria-label="Show as cards"
        title="Show as cards"
        aria-pressed={mode === 'cards'}
        data-active={mode === 'cards' ? 'true' : undefined}
        onClick={() => onChange('cards')}
      >
        <LayoutGrid size={17} />
      </button>
    </div>
  )
}
