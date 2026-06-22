import { ButtonHTMLAttributes, forwardRef, ReactNode } from 'react'
import './CircleIconButton.css'

export type CircleIconButtonSize = 'xs' | 'sm' | 'md' | 'lg'
export type CircleIconButtonVariant = 'bordered' | 'glass'

interface CircleIconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  size?: CircleIconButtonSize
  variant?: CircleIconButtonVariant
}

export const CircleIconButton = forwardRef<HTMLButtonElement, CircleIconButtonProps>(
  function CircleIconButton(
    {
      children,
      size = 'md',
      variant = 'bordered',
      className = '',
      type = 'button',
      ...props
    },
    ref
  ) {
    return (
      <button
        ref={ref}
        type={type}
        className={[
          'circle-icon-button',
          `circle-icon-button--${size}`,
          `circle-icon-button--${variant}`,
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...props}
      >
        {children}
      </button>
    )
  }
)
