import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { MENU_BACK_LINK } from '@/shared/config/menuBackNavigation'
import { useMenuBackLink } from '@/shared/hooks/useMenuBackLink'
import './MenuBackLink.css'

interface MenuBackLinkProps {
  className?: string
}

export function MenuBackLink({ className = '' }: MenuBackLinkProps) {
  const backLink = useMenuBackLink()

  if (!backLink) {
    return null
  }

  return (
    <Link
      to={backLink.to}
      className={`menu-back-link ${className}`.trim()}
      aria-label={MENU_BACK_LINK.label}
    >
      <ArrowLeft size={18} strokeWidth={1.75} aria-hidden />
    </Link>
  )
}
