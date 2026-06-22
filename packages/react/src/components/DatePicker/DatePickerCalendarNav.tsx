import { useEffect, useMemo, useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import {
  MonthGrid as DefaultMonthGrid,
  useDayPicker,
  type MonthCaptionProps,
  type MonthGridProps,
} from 'react-day-picker'
import './DatePickerCalendarNav.css'

export type PickerPanel = 'month' | 'year' | null

const MONTH_NAMES_SHORT = [
  'Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн',
  'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек',
]

export interface CalendarBounds {
  startMonth: Date
  endMonth: Date
}

interface DatePickerMonthCaptionProps extends MonthCaptionProps {
  activePanel: PickerPanel
  onPanelChange: (panel: PickerPanel) => void
}

function monthStart(year: number, monthIndex: number): Date {
  return new Date(year, monthIndex, 1)
}

function isMonthInBounds(date: Date, bounds: CalendarBounds): boolean {
  const start = monthStart(bounds.startMonth.getFullYear(), bounds.startMonth.getMonth())
  const end = monthStart(bounds.endMonth.getFullYear(), bounds.endMonth.getMonth())
  const target = monthStart(date.getFullYear(), date.getMonth())
  return target >= start && target <= end
}

export function DatePickerMonthCaption({
  calendarMonth,
  className,
  style,
  activePanel,
  onPanelChange,
  children: _captionChildren,
  displayIndex: _displayIndex,
  ...divProps
}: DatePickerMonthCaptionProps) {
  const { goToMonth, previousMonth, nextMonth, labels } = useDayPicker()
  const date = calendarMonth.date
  const month = date.getMonth()
  const year = date.getFullYear()

  const togglePanel = (panel: Exclude<PickerPanel, null>) => {
    onPanelChange(activePanel === panel ? null : panel)
  }

  return (
    <div
      className={['date-picker-caption', className].filter(Boolean).join(' ')}
      style={style}
      {...divProps}
    >
      <button
        type="button"
        className="date-picker-caption__nav"
        disabled={!previousMonth}
        onClick={() => previousMonth && goToMonth(previousMonth)}
        aria-label={labels.labelPrevious(previousMonth)}
      >
        <ChevronLeft size={16} strokeWidth={2} aria-hidden="true" />
      </button>

      <div className="date-picker-caption__title" role="group" aria-label="Выбор месяца и года">
        <button
          type="button"
          className={`date-picker-caption__picker date-picker-caption__picker--month${
            activePanel === 'month' ? ' date-picker-caption__picker--active' : ''
          }`}
          onClick={() => togglePanel('month')}
          aria-pressed={activePanel === 'month'}
          aria-label={`Месяц: ${MONTH_NAMES_SHORT[month]}`}
        >
          {MONTH_NAMES_SHORT[month]}
        </button>
        <span className="date-picker-caption__dot" aria-hidden="true">
          ·
        </span>
        <button
          type="button"
          className={`date-picker-caption__picker date-picker-caption__picker--year${
            activePanel === 'year' ? ' date-picker-caption__picker--active' : ''
          }`}
          onClick={() => togglePanel('year')}
          aria-pressed={activePanel === 'year'}
          aria-label={`Год: ${year}`}
        >
          {year}
        </button>
      </div>

      <button
        type="button"
        className="date-picker-caption__nav"
        disabled={!nextMonth}
        onClick={() => nextMonth && goToMonth(nextMonth)}
        aria-label={labels.labelNext(nextMonth)}
      >
        <ChevronRight size={16} strokeWidth={2} aria-hidden="true" />
      </button>
    </div>
  )
}

interface DatePickerPickerPanelProps {
  mode: Exclude<PickerPanel, null>
  onClose: () => void
  calendarBounds: CalendarBounds
  navigationBounds: CalendarBounds
}

function DatePickerPickerPanel({
  mode,
  onClose,
  calendarBounds,
  navigationBounds,
}: DatePickerPickerPanelProps) {
  const { goToMonth, months } = useDayPicker()
  const currentDate = months[0]?.date ?? new Date()
  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth()
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const activeYearRef = useRef<HTMLButtonElement | null>(null)

  const years = useMemo(() => {
    const startYear = navigationBounds.startMonth.getFullYear()
    const endYear = navigationBounds.endMonth.getFullYear()
    const items: number[] = []

    for (let y = startYear; y <= endYear; y += 1) {
      items.push(y)
    }

    return items
  }, [navigationBounds.endMonth, navigationBounds.startMonth])

  useEffect(() => {
    if (mode !== 'year' || !scrollRef.current || !activeYearRef.current) return

    const container = scrollRef.current
    const active = activeYearRef.current
    const targetTop =
      active.offsetTop - container.clientHeight / 2 + active.clientHeight / 2

    container.scrollTop = Math.max(0, targetTop)
  }, [mode, currentYear, years.length])

  if (mode === 'month') {
    return (
      <div className="date-picker-picker-panel date-picker-picker-panel--months" role="listbox" aria-label="Выбор месяца">
        {MONTH_NAMES_SHORT.map((label, monthIndex) => {
          const target = monthStart(currentYear, monthIndex)
          const disabled = !isMonthInBounds(target, calendarBounds)
          const selected = monthIndex === currentMonth

          return (
            <button
              key={label}
              type="button"
              role="option"
              aria-selected={selected}
              className={`date-picker-picker-panel__cell${
                selected ? ' date-picker-picker-panel__cell--selected' : ''
              }`}
              disabled={disabled}
              onClick={() => {
                goToMonth(target)
                onClose()
              }}
            >
              {label}
            </button>
          )
        })}
      </div>
    )
  }

  return (
    <div ref={scrollRef} className="date-picker-picker-panel-scroll">
      <div
        className="date-picker-picker-panel date-picker-picker-panel--years"
        role="listbox"
        aria-label="Выбор года"
      >
        {years.map((year) => {
          const target = monthStart(year, currentMonth)
          const disabled = !isMonthInBounds(target, calendarBounds)
          const selected = year === currentYear

          return (
            <button
              key={year}
              ref={selected ? activeYearRef : undefined}
              type="button"
              role="option"
              aria-selected={selected}
              className={`date-picker-picker-panel__cell${
                selected ? ' date-picker-picker-panel__cell--selected' : ''
              }`}
              disabled={disabled}
              onClick={() => {
                goToMonth(target)
                onClose()
              }}
            >
              {year}
            </button>
          )
        })}
      </div>
    </div>
  )
}

interface DatePickerMonthGridProps extends MonthGridProps {
  activePanel: PickerPanel
  onPanelChange: (panel: PickerPanel) => void
  calendarBounds: CalendarBounds
  navigationBounds: CalendarBounds
}

export function DatePickerMonthGrid({
  activePanel,
  onPanelChange,
  calendarBounds,
  navigationBounds,
  ...props
}: DatePickerMonthGridProps) {
  if (activePanel) {
    return (
      <div
        className={`date-picker-body${
          activePanel === 'year' ? ' date-picker-body--year-panel' : ''
        }`}
      >
        <DatePickerPickerPanel
          mode={activePanel}
          onClose={() => onPanelChange(null)}
          calendarBounds={calendarBounds}
          navigationBounds={navigationBounds}
        />
      </div>
    )
  }

  const { children, ...tableProps } = props
  return (
    <div className="date-picker-body">
      <DefaultMonthGrid {...tableProps}>{children}</DefaultMonthGrid>
    </div>
  )
}
