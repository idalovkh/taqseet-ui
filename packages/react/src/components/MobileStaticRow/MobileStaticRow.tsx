import type { ReactNode } from 'react'
import './MobileStaticRow.css'

export interface MobileStaticRowProps {
  label: string
  value: ReactNode
  valueVariant?: 'default' | 'primary' | 'amount'
}

export function MobileStaticRow({
  label,
  value,
  valueVariant = 'default',
}: MobileStaticRowProps) {
  const valueClass =
    valueVariant === 'amount'
      ? 'mobile-static-row__value mobile-static-row__value--amount'
      : valueVariant === 'primary'
        ? 'mobile-static-row__value mobile-static-row__value--primary'
        : 'mobile-static-row__value'

  return (
    <div className="mobile-static-row">
      <span className="mobile-static-row__label">{label}</span>
      <span className={valueClass}>{value}</span>
    </div>
  )
}

export function MobileGroupDivider() {
  return <hr className="mobile-group-divider" aria-hidden="true" />
}
