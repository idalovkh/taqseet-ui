import { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import { ChevronRight, ExternalLink } from 'lucide-react'
import './MobileNavRow.css'

export interface MobileNavRowProps {
  label: string
  icon?: ReactNode
  to?: string
  href?: string
  onClick?: () => void
  external?: boolean
  destructive?: boolean
  disabled?: boolean
  indent?: boolean
  trailing?: ReactNode
  showChevron?: boolean
  /** iOS-style centered accent action (e.g. «Оплатить») */
  primary?: boolean
}

function rowClassName({
  destructive,
  indent,
  hasIcon,
  primary,
}: {
  destructive?: boolean
  indent?: boolean
  hasIcon?: boolean
  primary?: boolean
}) {
  return [
    'mobile-nav-row',
    destructive ? 'mobile-nav-row--destructive' : '',
    primary ? 'mobile-nav-row--primary' : '',
    indent ? 'mobile-nav-row--indent' : '',
    hasIcon ? '' : 'mobile-nav-row--no-icon',
  ]
    .filter(Boolean)
    .join(' ')
}

function RowTrailing({
  external,
  destructive,
  trailing,
  showChevron = true,
}: {
  external?: boolean
  destructive?: boolean
  trailing?: ReactNode
  showChevron?: boolean
}) {
  if (destructive) return null

  return (
    <span className="mobile-nav-row__trailing">
      {trailing}
      {external ? <ExternalLink size={16} aria-hidden="true" /> : null}
      {showChevron ? <ChevronRight size={18} aria-hidden="true" /> : null}
    </span>
  )
}

function RowContent(props: MobileNavRowProps) {
  const { icon, label, external, destructive, trailing, showChevron } = props

  return (
    <>
      {icon ? <span className="mobile-nav-row__icon-wrap">{icon}</span> : null}
      <span className="mobile-nav-row__label">{label}</span>
      <RowTrailing
        external={external}
        destructive={destructive}
        trailing={trailing}
        showChevron={showChevron}
      />
    </>
  )
}

export function MobileNavGroup({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return <div className={`mobile-nav-group ${className}`.trim()}>{children}</div>
}

export function MobileNavRow(props: MobileNavRowProps) {
  const {
    icon,
    to,
    href,
    onClick,
    external = false,
    destructive = false,
    disabled = false,
    indent = false,
    primary = false,
  } = props

  const className = rowClassName({ destructive, indent, hasIcon: Boolean(icon), primary })

  if (to) {
    return (
      <NavLink
        to={to}
        className={className}
        onClick={onClick}
      >
        <RowContent {...props} />
      </NavLink>
    )
  }

  if (href) {
    return (
      <a
        href={href}
        className={className}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
        onClick={onClick}
      >
        <RowContent {...props} />
      </a>
    )
  }

  return (
    <button type="button" className={className} onClick={onClick} disabled={disabled}>
      <RowContent {...props} />
    </button>
  )
}
