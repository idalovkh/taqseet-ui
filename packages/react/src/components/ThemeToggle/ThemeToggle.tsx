import { useId } from 'react'
import { Moon } from 'lucide-react'
import { useTheme } from '@/shared/hooks/useTheme'
import './ThemeToggle.css'

export type ThemeToggleVariant = 'standalone' | 'inset-row'

interface ThemeToggleProps {
  /** `inset-row` — строка внутри MobileNavGroup (iOS Settings). */
  variant?: ThemeToggleVariant
  /** Подпись строки (inset-row), по умолчанию как в iOS — «Тёмный режим». */
  label?: string
}

export const ThemeToggle = ({ variant = 'standalone', label = 'Тёмный режим' }: ThemeToggleProps) => {
  const { resolvedTheme, toggleTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'
  const labelId = useId()

  if (variant === 'inset-row') {
    return (
      <div className="mobile-nav-row mobile-nav-row--switch">
        <span className="mobile-nav-row__icon-wrap" aria-hidden="true">
          <Moon size={20} aria-hidden="true" />
        </span>
        <span className="mobile-nav-row__label" id={labelId}>
          {label}
        </span>
        <span className="mobile-nav-row__trailing">
          <button
            type="button"
            role="switch"
            className={`theme-toggle-switch theme-toggle-switch--row${isDark ? ' theme-toggle-switch-on' : ''}`}
            aria-checked={isDark}
            aria-labelledby={labelId}
            onClick={toggleTheme}
          >
            <span className="theme-toggle-switch-handle" aria-hidden="true" />
          </button>
        </span>
      </div>
    )
  }

  return (
    <button className="theme-toggle" onClick={toggleTheme} aria-label="Переключить тему">
      <div className="theme-toggle-content">
        <Moon size={18} strokeWidth={2} aria-hidden="true" />
        <span>{label}</span>
      </div>
      <div className={`theme-toggle-switch ${isDark ? 'theme-toggle-switch-on' : ''}`}>
        <div className="theme-toggle-switch-handle" />
      </div>
    </button>
  )
}
