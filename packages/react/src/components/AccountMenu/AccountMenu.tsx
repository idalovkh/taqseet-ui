import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'

interface AccountMenuContextValue {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

const AccountMenuContext = createContext<AccountMenuContextValue | null>(null)

function useAccountMenuContext() {
  const ctx = useContext(AccountMenuContext)
  if (!ctx) {
    throw new Error('AccountMenu components must be used within AccountMenu')
  }
  return ctx
}

/** Close/open control for app-specific menu item handlers. */
export function useAccountMenu() {
  return useAccountMenuContext()
}

export interface AccountMenuProps {
  children: ReactNode
  className?: string
}

export function AccountMenu({ children, className = '' }: AccountMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen])

  return (
    <AccountMenuContext.Provider value={{ isOpen, setIsOpen }}>
      <div className={`account-menu ${className}`.trim()} ref={menuRef}>
        {children}
      </div>
    </AccountMenuContext.Provider>
  )
}

export interface AccountMenuTriggerProps {
  children: ReactNode
  ariaLabel?: string
  className?: string
}

export function AccountMenuTrigger({
  children,
  ariaLabel = 'Account menu',
  className = '',
}: AccountMenuTriggerProps) {
  const { isOpen, setIsOpen } = useAccountMenuContext()

  return (
    <button
      type="button"
      className={`account-menu__trigger ${className}`.trim()}
      onClick={() => setIsOpen(!isOpen)}
      aria-label={ariaLabel}
      aria-expanded={isOpen}
    >
      {children}
    </button>
  )
}

export interface AccountMenuPanelProps {
  children: ReactNode
  className?: string
}

export function AccountMenuPanel({ children, className = '' }: AccountMenuPanelProps) {
  const { isOpen } = useAccountMenuContext()
  if (!isOpen) return null

  return <div className={`account-menu__panel ${className}`.trim()}>{children}</div>
}

export interface AccountMenuSectionProps {
  children: ReactNode
  className?: string
}

export function AccountMenuSection({ children, className = '' }: AccountMenuSectionProps) {
  return <div className={`account-menu__section ${className}`.trim()}>{children}</div>
}

export function AccountMenuDivider() {
  return <div className="account-menu__divider" role="separator" />
}
