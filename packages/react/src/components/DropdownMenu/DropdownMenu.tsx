import React, { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import './DropdownMenu.css'

export interface DropdownMenuItem {
  key: string
  label: string
  icon?: React.ReactNode
  onClick: () => void
  danger?: boolean
  disabled?: boolean
}

interface DropdownMenuProps {
  trigger: React.ReactElement
  items: DropdownMenuItem[]
  align?: 'left' | 'right'
  width?: string | number
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({
  trigger,
  items,
  align = 'right',
  width,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [position, setPosition] = useState<'bottom' | 'top'>('bottom')
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({})
  const menuRef = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLDivElement>(null)

  // Позиция: сначала по триггеру + оценка высоты (без мерцания), потом уточнение после layout
  useEffect(() => {
    if (!isOpen || !triggerRef.current) return

    const dropdownWidth = width
      ? (typeof width === 'number' ? width : parseInt(String(width), 10) || 180)
      : 180
    const estimatedItemHeight = 44
    const estimatedPadding = 16
    const estimatedHeight = items.length * estimatedItemHeight + estimatedPadding

    const run = (triggerRect: DOMRect, actualHeight: number) => {
      const padding = 8
      const spaceBelow = window.innerHeight - triggerRect.bottom - padding
      const spaceAbove = triggerRect.top - padding
      const height = actualHeight > 0 ? actualHeight : estimatedHeight

      const shouldOpenUp = spaceBelow < height && spaceAbove > spaceBelow
      setPosition(shouldOpenUp ? 'top' : 'bottom')

      let left = align === 'right'
        ? triggerRect.right - dropdownWidth
        : triggerRect.left
      let top = shouldOpenUp
        ? triggerRect.top - height - 4
        : triggerRect.bottom + 4

      left = Math.max(8, Math.min(left, window.innerWidth - dropdownWidth - 8))
      top = Math.max(8, Math.min(top, window.innerHeight - height - 8))

      const style: React.CSSProperties = {
        position: 'fixed',
        left: `${left}px`,
        top: `${top}px`,
        zIndex: 10000,
      }

      if (width) {
        const widthPx = typeof width === 'number' ? `${width}px` : String(width)
        style.width = widthPx
        style.minWidth = widthPx
        style.maxWidth = widthPx
      }

      setDropdownStyle(style)
    }

    const triggerRect = triggerRef.current.getBoundingClientRect()
    run(triggerRect, estimatedHeight)

    requestAnimationFrame(() => {
      if (!triggerRef.current || !dropdownRef.current) return
      const rect = triggerRef.current.getBoundingClientRect()
      const actualHeight = dropdownRef.current.offsetHeight || estimatedHeight
      if (actualHeight > 0) run(rect, actualHeight)
    })
  }, [isOpen, align, width, items.length])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      if (
        menuRef.current &&
        !menuRef.current.contains(target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(target)
      ) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      // Use capture phase to catch clicks before they bubble
      document.addEventListener('mousedown', handleClickOutside, true)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside, true)
    }
  }, [isOpen])

  const handleItemClick = (item: DropdownMenuItem) => {
    if (item.disabled) return
    item.onClick()
    setIsOpen(false)
  }

  return (
    <div className="dropdown-menu-wrapper" ref={menuRef}>
      <div
        ref={triggerRef}
        className="dropdown-menu-trigger-slot"
        onClick={() => setIsOpen(!isOpen)}
      >
        {trigger}
      </div>
      {isOpen && items.length > 0 && createPortal(
        <div
          ref={dropdownRef}
          className={`dropdown-menu dropdown-menu-${align} dropdown-menu-${position}`}
          style={dropdownStyle}
        >
          {items.map((item) => (
            <button
              key={item.key}
              className={`dropdown-menu-item ${item.danger ? 'dropdown-menu-item-danger' : ''} ${item.disabled ? 'dropdown-menu-item-disabled' : ''}`}
              onClick={() => handleItemClick(item)}
              disabled={item.disabled}
              type="button"
            >
              {item.icon && <span className="dropdown-menu-item-icon">{item.icon}</span>}
              <span className="dropdown-menu-item-text">{item.label}</span>
            </button>
          ))}
        </div>,
        document.body
      )}
    </div>
  )
}

