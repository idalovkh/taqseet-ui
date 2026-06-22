import { Plus } from 'lucide-react'
import './ListPageCreateButton.css'

interface ListPageCreateButtonProps {
  label: string
  onClick: () => void
  disabled?: boolean
  /** Fixed FAB над BottomNav (mobile) */
  floating?: boolean
}

export function ListPageCreateButton({
  label,
  onClick,
  disabled,
  floating = false,
}: ListPageCreateButtonProps) {
  return (
    <button
      type="button"
      className={`list-page-create-btn${floating ? ' list-page-create-btn--fab' : ''}`}
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
    >
      <Plus size={22} strokeWidth={2.25} aria-hidden="true" />
    </button>
  )
}
