/**
 * SearchableSelect Component
 * Wrapper around react-select with consistent styling
 */

import React, { useLayoutEffect, useRef, useState } from 'react'
import { Tooltip } from '@/shared/components/ui/Tooltip'
import { createPortal } from 'react-dom'
import Select, { Props as SelectProps, StylesConfig, GroupBase } from 'react-select'
import './SearchableSelect.css'

const MENU_GAP = 4
const MENU_PORTAL_Z_INDEX = 10000

interface FrozenMenuPortalProps {
  appendTo?: HTMLElement | null
  children: React.ReactNode
  controlElement: HTMLDivElement | null
  innerProps?: React.HTMLAttributes<HTMLDivElement>
  menuPosition: 'absolute' | 'fixed'
}

/**
 * Portal that fixes menu position once when opened (under the control).
 * Does not use floating-ui autoUpdate — position never updates on scroll/resize,
 * so the list stays anchored and does not jerk.
 */
function FrozenMenuPortal({
  appendTo,
  children,
  controlElement,
  innerProps,
  menuPosition,
}: FrozenMenuPortalProps) {
  const [frozenStyle, setFrozenStyle] = useState<React.CSSProperties | null>(null)
  const computedOnce = useRef(false)

  useLayoutEffect(() => {
    if (!controlElement || !appendTo || computedOnce.current) return
    const rect = controlElement.getBoundingClientRect()
    setFrozenStyle({
      position: menuPosition === 'fixed' ? 'fixed' : 'absolute',
      left: rect.left,
      top: rect.bottom + MENU_GAP,
      width: rect.width,
      minWidth: rect.width,
      zIndex: MENU_PORTAL_Z_INDEX,
    })
    computedOnce.current = true
  }, [controlElement, appendTo, menuPosition])

  if (!frozenStyle) return null

  const safeInnerProps = innerProps ?? {}
  const menuWrapper = (
    <div {...safeInnerProps} style={{ ...(safeInnerProps.style ?? {}), ...frozenStyle }}>
      {children}
    </div>
  )

  return appendTo ? createPortal(menuWrapper, appendTo) : menuWrapper
}

export interface SelectOption {
  value: string
  label: string
}

export interface SearchableSelectProps extends Omit<SelectProps<SelectOption, false, GroupBase<SelectOption>>, 'options'> {
  label?: string
  /** Подсказка при наведении на иконку i рядом с label */
  labelTooltip?: string
  error?: string
  options: SelectOption[]
  required?: boolean
}

// Custom styles matching ContactEditRow / PersonsDetailsPage design
const customStyles: StylesConfig<SelectOption, false> = {
  control: (base, state) => ({
    ...base,
    minHeight: '36px',
    height: '36px',
    fontSize: '14px',
    fontFamily: 'inherit',
    backgroundColor: 'var(--color-bg-input)',
    borderColor: state.isFocused 
      ? 'var(--color-primary)'
      : 'var(--color-border-input)',
    borderRadius: '6px',
    boxShadow: state.isFocused 
      ? '0 0 0 2px var(--color-focus-ring)'
      : 'none',
    transition: 'border-color 0.2s',
    '&:hover': {
      borderColor: state.isFocused 
        ? 'var(--color-primary)'
        : 'var(--color-border-input)',
    },
    cursor: state.isDisabled ? 'not-allowed' : 'pointer',
    opacity: state.isDisabled ? 0.6 : 1,
  }),
  valueContainer: (base) => ({
    ...base,
    padding: '2px 10px',
    height: '34px',
  }),
  placeholder: (base) => ({
    ...base,
    color: 'var(--color-text-tertiary)',
    fontSize: '14px',
  }),
  singleValue: (base) => ({
    ...base,
    color: 'var(--color-text-primary)',
    fontSize: '14px',
  }),
  input: (base) => ({
    ...base,
    color: 'var(--color-text-primary)',
    fontSize: '14px',
    margin: 0,
    padding: 0,
  }),
  indicatorSeparator: () => ({
    display: 'none',
  }),
  indicatorsContainer: (base) => ({
    ...base,
    height: '34px',
  }),
  dropdownIndicator: (base, state) => ({
    ...base,
    color: 'var(--color-text-tertiary)',
    padding: '0 8px',
    transform: state.selectProps.menuIsOpen ? 'rotate(180deg)' : undefined,
    transition: 'transform 0.2s ease',
    '&:hover': {
      color: 'var(--color-text-secondary)',
    },
  }),
  clearIndicator: (base) => ({
    ...base,
    color: 'var(--color-text-tertiary)',
    padding: '0 4px',
    '&:hover': {
      color: 'var(--color-danger)',
    },
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: 'var(--color-bg-surface-elevated)',
    border: '1px solid var(--color-border-default)',
    borderRadius: '6px',
    boxShadow: 'var(--shadow-dropdown)',
    marginTop: '4px',
    zIndex: 10000,
  }),
  menuPortal: (base) => ({
    ...base,
    zIndex: 10000,
  }),
  menuList: (base) => ({
    ...base,
    padding: '4px',
    maxHeight: '200px',
  }),
  option: (base, state) => ({
    ...base,
    fontSize: '14px',
    padding: '8px 10px',
    borderRadius: '4px',
    cursor: 'pointer',
    backgroundColor: state.isSelected
      ? 'var(--color-primary)'
      : state.isFocused
        ? 'var(--color-bg-secondary)'
        : 'transparent',
    color: state.isSelected
      ? 'var(--color-text-on-primary)'
      : 'var(--color-text-primary)',
    '&:active': {
      backgroundColor: state.isSelected
        ? 'var(--color-primary)'
        : 'var(--color-bg-tertiary)',
    },
  }),
  noOptionsMessage: (base) => ({
    ...base,
    fontSize: '14px',
    color: 'var(--color-text-tertiary)',
    padding: '8px 10px',
  }),
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({
  label,
  labelTooltip,
  error,
  options,
  required,
  className = '',
  placeholder = 'Выберите...',
  noOptionsMessage = () => 'Ничего не найдено',
  ...props
}) => {
  return (
    <div className={`searchable-select-wrapper ${className}`}>
      {label && (
        <label className={`searchable-select-label ${labelTooltip ? 'searchable-select-label--with-tooltip' : ''}`}>
          {label}
          {labelTooltip && (
            <Tooltip content={labelTooltip} placement="top">
              <span className="tooltip-trigger" aria-hidden="true">i</span>
            </Tooltip>
          )}
        </label>
      )}
      <Select<SelectOption, false>
        options={options}
        styles={customStyles}
        placeholder={placeholder}
        noOptionsMessage={noOptionsMessage}
        classNamePrefix="searchable-select"
        isClearable
        menuPortalTarget={document.body}
        menuPosition="fixed"
        menuPlacement="bottom"
        closeMenuOnScroll={(e) => !(e.target as HTMLElement).closest('[class*="searchable-select__menu"]')}
        components={{ MenuPortal: FrozenMenuPortal as never }}
        {...props}
      />
      {error && <span className="searchable-select-error">{error}</span>}
    </div>
  )
}
