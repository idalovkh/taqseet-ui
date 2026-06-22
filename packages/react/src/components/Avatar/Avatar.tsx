import './Avatar.css'

interface AvatarProps {
  name?: string
  size?: 'small' | 'medium' | 'large'
  className?: string
}

export const Avatar = ({ name, size = 'medium', className = '' }: AvatarProps) => {
  const getInitials = (fullName?: string): string => {
    if (!fullName) return '?'
    const parts = fullName.trim().split(' ')
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
    }
    return fullName[0].toUpperCase()
  }

  return (
    <div className={`avatar avatar-${size} ${className}`}>
      {getInitials(name)}
    </div>
  )
}
