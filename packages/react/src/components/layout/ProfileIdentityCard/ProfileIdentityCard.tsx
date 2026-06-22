import { ChevronRight } from 'lucide-react'
import { formatSurnameAndInitials } from '@/shared/utils/formatters'
import './ProfileIdentityCard.css'

export interface ProfileIdentityCardProps {
  fullName: string
  avatarLetter: string
  email?: string
  organizationName?: string
  roleDisplay?: string
  onOpenProfile?: () => void
  /** `menu` — sheet AppMenu; `dropdown` — header ProfileMenu; `page` — read-only on profile page */
  variant?: 'menu' | 'dropdown' | 'page'
}

function IdentityContent({
  fullName,
  avatarLetter,
  email,
  organizationName,
  roleDisplay,
  variant,
}: Omit<ProfileIdentityCardProps, 'onOpenProfile'>) {
  const displayName = variant === 'page' ? fullName : formatSurnameAndInitials(fullName)
  const showDetails = variant === 'page'

  return (
    <>
      <div className="profile-identity-card__avatar" aria-hidden="true">
        {avatarLetter}
      </div>
      <div className="profile-identity-card__info">
        <div className="profile-identity-card__name" title={fullName}>
          {displayName}
        </div>
        {showDetails && email ? <div className="profile-identity-card__email">{email}</div> : null}
        {organizationName || (showDetails && roleDisplay) ? (
          <div className="profile-identity-card__org">
            {organizationName ? (
              <span className="profile-identity-card__org-name">{organizationName}</span>
            ) : null}
            {showDetails && roleDisplay ? (
              <span className="profile-identity-card__role">{roleDisplay}</span>
            ) : null}
          </div>
        ) : null}
      </div>
      {variant !== 'page' ? (
        <ChevronRight className="profile-identity-card__chevron" size={20} aria-hidden="true" />
      ) : null}
    </>
  )
}

export function ProfileIdentityCard({
  fullName,
  avatarLetter,
  email,
  organizationName,
  roleDisplay,
  onOpenProfile,
  variant = 'menu',
}: ProfileIdentityCardProps) {
  const isPage = variant === 'page'

  return (
    <div className={`profile-identity-card profile-identity-card--${variant}`}>
      {isPage ? (
        <div className="profile-identity-card__main profile-identity-card__main--static">
          <IdentityContent
            fullName={fullName}
            avatarLetter={avatarLetter}
            email={email}
            organizationName={organizationName}
            roleDisplay={roleDisplay}
            variant={variant}
          />
        </div>
      ) : (
        <button
          type="button"
          className="profile-identity-card__main"
          onClick={onOpenProfile}
          aria-label="Мой профиль"
        >
          <IdentityContent
            fullName={fullName}
            avatarLetter={avatarLetter}
            email={email}
            organizationName={organizationName}
            roleDisplay={roleDisplay}
            variant={variant}
          />
        </button>
      )}
    </div>
  )
}
