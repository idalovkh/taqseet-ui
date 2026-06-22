import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type ClipboardEvent,
  type FocusEvent,
  type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'
import { DayPicker, type Matcher, type MonthCaptionProps, type MonthGridProps } from 'react-day-picker'
import { ru } from 'react-day-picker/locale'
import {
  useFloating,
  offset,
  flip,
  shift,
  autoUpdate,
} from '@floating-ui/react-dom'
import { Calendar } from 'lucide-react'
import { BottomSheet } from '@/shared/components/ui/BottomSheet'
import { Tooltip } from '@/shared/components/ui/Tooltip'
import { useModalPortalContainer } from '@/shared/components/ui/Modal/ModalPortalContext'
import { useBreakpoint } from '@/shared/hooks/useBreakpoint'
import {
  dateToIso,
  formatDateDisplay,
  formatDateInputMask,
  isoToDate,
  parseFlexibleDate,
} from '@/shared/utils/dateInput'
import 'react-day-picker/style.css'
import '../Input/Input.css'
import './DatePicker.css'
import {
  DatePickerMonthCaption,
  DatePickerMonthGrid,
  type PickerPanel,
} from './DatePickerCalendarNav'

const DATE_PICKER_YEAR_MIN = 1945

export interface DatePickerProps {
  label?: ReactNode
  labelTooltip?: string
  labelClassName?: string
  error?: string
  warning?: string
  helperText?: string
  value?: string
  defaultValue?: string
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void
  onBlur?: (event: FocusEvent<HTMLInputElement>) => void
  name?: string
  id?: string
  className?: string
  triggerClassName?: string
  disabled?: boolean
  required?: boolean
  min?: string
  max?: string
  placeholder?: string
  autoComplete?: string
  /** Поверх вложенных оверлеев (например, панели «С — По» в фильтре периода). */
  popoverZIndex?: number
}

function createChangeEvent(name: string | undefined, value: string): ChangeEvent<HTMLInputElement> {
  return {
    target: { value, name: name ?? '' },
    currentTarget: { value, name: name ?? '' },
  } as ChangeEvent<HTMLInputElement>
}

export const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
  (
    {
      label,
      labelTooltip,
      labelClassName,
      error,
      warning,
      helperText,
      value,
      defaultValue,
      onChange,
      onBlur,
      name,
      id,
      className = '',
      triggerClassName = '',
      disabled = false,
      required,
      min,
      max,
      placeholder = 'Выберите дату',
      autoComplete,
      popoverZIndex,
    },
    ref
  ) => {
    const generatedId = useId()
    const fieldId = id || (label ? `date-${generatedId}` : undefined)
    const [isOpen, setIsOpen] = useState(false)
    const [pickerPanel, setPickerPanel] = useState<PickerPanel>(null)
    const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue ?? '')
    const [typedValue, setTypedValue] = useState('')
    const { isDesktop } = useBreakpoint()
    const modalPortalRef = useModalPortalContainer()
    const useSheetPresentation = !isDesktop
    const portalRootRef = useRef<HTMLDivElement | null>(null)
    const hiddenInputRef = useRef<HTMLInputElement | null>(null)
    const triggerRef = useRef<HTMLButtonElement | null>(null)
    const popoverRef = useRef<HTMLDivElement | null>(null)

    const isControlled = value !== undefined
    const currentValue = isControlled ? value : uncontrolledValue
    const selectedDate = useMemo(() => isoToDate(currentValue), [currentValue])
    const displayValue = formatDateDisplay(currentValue)

    useEffect(() => {
      setTypedValue(displayValue)
    }, [displayValue])

    const disabledDays = useMemo(() => {
      const matchers: Matcher[] = []
      const minDate = isoToDate(min)
      const maxDate = isoToDate(max)
      if (minDate) matchers.push({ before: minDate })
      if (maxDate) matchers.push({ after: maxDate })
      return matchers.length > 0 ? matchers : undefined
    }, [min, max])

    const selectionBounds = useMemo(() => {
      const now = new Date()
      const currentYear = now.getFullYear()
      const minDate = isoToDate(min)
      const maxDate = isoToDate(max)

      let startYear = minDate?.getFullYear() ?? DATE_PICKER_YEAR_MIN
      startYear = Math.max(DATE_PICKER_YEAR_MIN, startYear)
      let endYear = maxDate?.getFullYear() ?? currentYear + 20

      if (selectedDate) {
        startYear = Math.min(startYear, selectedDate.getFullYear())
        endYear = Math.max(endYear, selectedDate.getFullYear())
      }

      const startMonth = minDate
        ? new Date(minDate.getFullYear(), minDate.getMonth(), 1)
        : new Date(startYear, 0, 1)
      const endMonth = maxDate
        ? new Date(maxDate.getFullYear(), maxDate.getMonth(), 1)
        : new Date(endYear, 11, 1)

      return { startMonth, endMonth }
    }, [min, max, selectedDate])

    const navigationBounds = useMemo(() => {
      const now = new Date()
      const currentYear = now.getFullYear()
      let startYear = DATE_PICKER_YEAR_MIN
      let endYear = Math.max(currentYear + 20, selectionBounds.endMonth.getFullYear())

      if (selectedDate) {
        startYear = Math.min(startYear, selectedDate.getFullYear())
        endYear = Math.max(endYear, selectedDate.getFullYear())
      }

      startYear = Math.max(DATE_PICKER_YEAR_MIN, startYear)

      return {
        startMonth: new Date(startYear, 0, 1),
        endMonth: new Date(endYear, 11, 1),
      }
    }, [selectedDate, selectionBounds])

    const dayPickerComponents = useMemo(
      () => ({
        MonthCaption: (props: MonthCaptionProps) => (
          <DatePickerMonthCaption
            {...props}
            activePanel={pickerPanel}
            onPanelChange={setPickerPanel}
          />
        ),
        MonthGrid: (props: MonthGridProps) => (
          <DatePickerMonthGrid
            {...props}
            activePanel={pickerPanel}
            onPanelChange={setPickerPanel}
            calendarBounds={selectionBounds}
            navigationBounds={navigationBounds}
          />
        ),
      }),
      [pickerPanel, selectionBounds, navigationBounds]
    )

    useEffect(() => {
      if (!isOpen) {
        setPickerPanel(null)
      }
    }, [isOpen])

    const closePicker = useCallback(() => {
      setIsOpen(false)
      triggerRef.current?.focus()
    }, [])

    const { refs, floatingStyles } = useFloating({
      placement: 'bottom-start',
      strategy: 'fixed',
      open: isOpen && !useSheetPresentation,
      middleware: [offset(6), flip({ padding: 8 }), shift({ padding: 8 })],
      whileElementsMounted: autoUpdate,
    })

    useEffect(() => {
      if (typeof document === 'undefined') return
      const el = document.createElement('div')
      el.setAttribute('data-date-picker-portal', '')
      document.body.appendChild(el)
      portalRootRef.current = el
      return () => {
        if (el.parentNode) {
          el.parentNode.removeChild(el)
        }
        portalRootRef.current = null
      }
    }, [])

    useEffect(() => {
      if (!isOpen || useSheetPresentation) return

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') closePicker()
      }

      const handlePointerDown = (event: MouseEvent) => {
        const target = event.target as Node
        if (triggerRef.current?.contains(target)) return
        if (popoverRef.current?.contains(target)) return
        closePicker()
      }

      document.addEventListener('keydown', handleKeyDown)
      document.addEventListener('mousedown', handlePointerDown)
      return () => {
        document.removeEventListener('keydown', handleKeyDown)
        document.removeEventListener('mousedown', handlePointerDown)
      }
    }, [closePicker, isOpen, useSheetPresentation])

    const setRef = useCallback(
      (node: HTMLInputElement | null) => {
        hiddenInputRef.current = node
        if (typeof ref === 'function') {
          ref(node)
        } else if (ref) {
          ref.current = node
        }
      },
      [ref]
    )

    const commitValue = useCallback(
      (nextValue: string) => {
        if (!isControlled) {
          setUncontrolledValue(nextValue)
        }
        onChange?.(createChangeEvent(name, nextValue))
      },
      [isControlled, name, onChange]
    )

    const isWithinBounds = useCallback(
      (isoValue: string) => {
        const date = isoToDate(isoValue)
        if (!date) return false
        const minDate = isoToDate(min)
        const maxDate = isoToDate(max)
        if (minDate && date < minDate) return false
        if (maxDate && date > maxDate) return false
        return true
      },
      [max, min]
    )

    const parseTypedInput = useCallback(
      (input: string): string | null => {
        const normalized = input.trim()
        if (!normalized) return ''

        const directIso = isoToDate(normalized) ? normalized : null
        if (directIso) {
          return isWithinBounds(directIso) ? directIso : null
        }

        const parsed = parseFlexibleDate(normalized)
        if (!parsed) return null
        return isWithinBounds(parsed) ? parsed : null
      },
      [isWithinBounds]
    )

    const applyTypedInput = useCallback(
      (rawInput: string) => {
        const parsed = parseTypedInput(rawInput)
        if (parsed === null) {
          setTypedValue(displayValue)
          return
        }
        commitValue(parsed)
      },
      [commitValue, displayValue, parseTypedInput]
    )

    const handleSelect = useCallback(
      (date: Date | undefined) => {
        if (!date) return
        commitValue(dateToIso(date))
        setIsOpen(false)
        triggerRef.current?.focus()
      },
      [commitValue]
    )

    const handlePaste = useCallback(
      (event: ClipboardEvent<HTMLInputElement>) => {
        const parsed = parseFlexibleDate(event.clipboardData.getData('text'))
        if (!parsed || !isWithinBounds(parsed)) return
        event.preventDefault()
        commitValue(parsed)
      },
      [commitValue, isWithinBounds]
    )

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
      setTypedValue(formatDateInputMask(event.target.value))
    }

    const handleInputBlur = (event: FocusEvent<HTMLInputElement>) => {
      applyTypedInput(event.target.value)
      onBlur?.(event)
    }

    const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (disabled) return
      if (event.key === 'Enter') {
        event.preventDefault()
        applyTypedInput(event.currentTarget.value)
      }
      if (event.key === 'ArrowDown') {
        event.preventDefault()
        setIsOpen(true)
      }
    }

    const labelClass = labelClassName ?? `input-label ${labelTooltip ? 'input-label--with-tooltip' : ''}`
    const triggerClasses = [
      'input',
      triggerClassName,
      error ? 'input-error date-picker-trigger--error' : '',
      warning && !error ? 'input-warning date-picker-trigger--warning' : '',
    ]
      .filter(Boolean)
      .join(' ')

    const calendarLabel = typeof label === 'string' ? label : 'Выберите дату'
    const shellClass = useSheetPresentation
      ? 'date-picker-calendar-shell date-picker-calendar-shell--touch'
      : 'date-picker-calendar-shell date-picker-calendar-shell--compact'

    const calendarContent = (
      <div className={shellClass}>
        <DayPicker
          mode="single"
          locale={ru}
          selected={selectedDate}
          onSelect={handleSelect}
          disabled={disabledDays}
          defaultMonth={selectedDate ?? undefined}
          startMonth={navigationBounds.startMonth}
          endMonth={navigationBounds.endMonth}
          captionLayout="label"
          hideNavigation
          components={dayPickerComponents}
          className={`date-picker-calendar${pickerPanel ? ' date-picker-calendar--picker-open' : ''}`}
          showOutsideDays={false}
        />
      </div>
    )

    const portalTarget = modalPortalRef?.current ?? portalRootRef.current
    const isNestedInModal = Boolean(modalPortalRef?.current)

    const overlay =
      isOpen && portalTarget ? (
        useSheetPresentation ? (
          <BottomSheet
            isOpen={isOpen}
            onClose={closePicker}
            title={calendarLabel}
            portalContainer={portalTarget}
            nested={isNestedInModal}
            overlayZIndex={popoverZIndex}
          >
            {calendarContent}
          </BottomSheet>
        ) : (
          createPortal(
            <div
              ref={(node) => {
                popoverRef.current = node
                refs.setFloating(node)
              }}
              className={`date-picker-popover${isNestedInModal ? ' date-picker-popover--nested' : ''}`}
              style={{
                ...floatingStyles,
                ...(popoverZIndex != null ? { zIndex: popoverZIndex } : {}),
              }}
              role="dialog"
              aria-label={calendarLabel}
            >
              {calendarContent}
            </div>,
            portalTarget
          )
        )
      ) : null

    return (
      <div className={`input-wrapper ${className}`}>
        {label && fieldId && (
          <label htmlFor={fieldId} className={labelClass}>
            {label}
            {labelTooltip && (
              <Tooltip content={labelTooltip} placement="top">
                <span className="tooltip-trigger" aria-hidden="true">
                  i
                </span>
              </Tooltip>
            )}
          </label>
        )}
        {label && !fieldId && (
          <span className={labelClass}>
            {label}
            {labelTooltip && (
              <Tooltip content={labelTooltip} placement="top">
                <span className="tooltip-trigger" aria-hidden="true">
                  i
                </span>
              </Tooltip>
            )}
          </span>
        )}

        <input
          ref={setRef}
          type="hidden"
          name={name}
          value={currentValue}
          autoComplete={autoComplete}
          required={required}
          onBlur={onBlur}
          tabIndex={-1}
          aria-hidden="true"
        />

        <div className="date-picker-trigger">
          <input
            id={fieldId}
            type="text"
            inputMode="numeric"
            className={triggerClasses}
            value={typedValue}
            disabled={disabled}
            placeholder={placeholder}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            onPaste={handlePaste}
            onKeyDown={handleInputKeyDown}
          />
          <button
            ref={(node) => {
              triggerRef.current = node
              refs.setReference(node)
            }}
            type="button"
            className="date-picker-trigger__button"
            disabled={disabled}
            aria-label="Открыть календарь"
            aria-haspopup="dialog"
            aria-expanded={isOpen}
            onClick={() => !disabled && setIsOpen((open) => !open)}
          >
            <Calendar size={18} className="date-picker-trigger__icon" aria-hidden="true" />
          </button>
        </div>

        {error && <span className="input-error-message">{error}</span>}
        {warning && !error && <span className="input-warning-message">{warning}</span>}
        {helperText && !error && !warning && (
          <span className="input-helper-text">{helperText}</span>
        )}

        {overlay}
      </div>
    )
  }
)

DatePicker.displayName = 'DatePicker'
