import { ButtonHTMLAttributes, forwardRef } from 'react'
import { X } from 'lucide-react'
import {
  CircleIconButton,
  type CircleIconButtonSize,
  type CircleIconButtonVariant,
} from './CircleIconButton'

interface DismissButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: CircleIconButtonSize
  variant?: CircleIconButtonVariant
  iconSize?: number
}

const DEFAULT_ICON_SIZE: Record<CircleIconButtonSize, number> = {
  xs: 16,
  sm: 18,
  md: 18,
  lg: 24,
}

export const DismissButton = forwardRef<HTMLButtonElement, DismissButtonProps>(
  function DismissButton(
    {
      size = 'md',
      variant = 'bordered',
      iconSize,
      className = '',
      'aria-label': ariaLabel = 'Закрыть',
      ...props
    },
    ref
  ) {
    return (
      <CircleIconButton
        ref={ref}
        size={size}
        variant={variant}
        className={className}
        aria-label={ariaLabel}
        {...props}
      >
        <X size={iconSize ?? DEFAULT_ICON_SIZE[size]} aria-hidden="true" />
      </CircleIconButton>
    )
  }
)
