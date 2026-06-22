import { useCallback, useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { autoUpdate, flip, offset, shift, useFloating } from '@floating-ui/react-dom'
import { ChevronDown } from 'lucide-react'
import { Button } from '@/shared/components/ui/Button/Button'
import { BottomSheet } from '@/shared/components/ui/BottomSheet'
import { DatePicker } from '@/shared/components/ui/DatePicker'
import { useBreakpoint } from '@/shared/hooks/useBreakpoint'
import {
  DATE_PERIOD_PRESET_LABELS,
  type DatePeriod,
  type DatePeriodDirection,
  type DatePeriodPreset,
  resolveDatePeriod,
} from '@/shared/utils/datePeriod'
import './DatePeriodFilter.css'

const PANEL_PRESETS: DatePeriodPreset[] = ['today', 'week', 'month', 'quarter', 'year']

const PERIOD_PANEL_Z_INDEX = 10000
const PERIOD_DATE_PICKER_Z_INDEX = PERIOD_PANEL_Z_INDEX + 1

interface DatePeriodFilterProps {
  value: DatePeriod
  onChange: (value: DatePeriod) => void
  ariaLabel?: string
  /** Для отчётов «к получению»: период от сегодня вперёд */
  direction?: DatePeriodDirection
  /** Показать пресет «Всё время» (без фильтра по датам) */
  includeAllTime?: boolean
}

function normalizeRange(from: string, to: string): { from: string; to: string } {
  if (from <= to) return { from, to }
  return { from: to, to: from }
}

function formatIsoShort(value: string): string {
  if (!value || value.length < 10) return value
  return `${value.slice(8, 10)}.${value.slice(5, 7)}`
}

function isInsideDatePickerOverlay(node: Node): boolean {
  if (!(node instanceof Element)) return false
  return Boolean(
    node.closest('.date-picker-popover, .bottom-sheet, .bottom-sheet-overlay')
  )
}

export function DatePeriodFilter({
  value,
  onChange,
  ariaLabel = 'Фильтр периода',
  direction = 'past',
  includeAllTime = false,
}: DatePeriodFilterProps) {
  const { isDesktop } = useBreakpoint()
  const useSheetPresentation = !isDesktop
  const panelPresets = useMemo(
    () => (includeAllTime ? (['all', ...PANEL_PRESETS] as DatePeriodPreset[]) : PANEL_PRESETS),
    [includeAllTime]
  )
  const [customOpen, setCustomOpen] = useState(false)
  const [customFrom, setCustomFrom] = useState(value.dateFrom)
  const [customTo, setCustomTo] = useState(value.dateTo)

  const { refs, floatingStyles, isPositioned } = useFloating({
    placement: 'bottom',
    strategy: 'fixed',
    open: customOpen && isDesktop,
    middleware: [offset(4), flip({ padding: 8 }), shift({ padding: 8 })],
    whileElementsMounted: autoUpdate,
  })

  const syncDraftFromValue = useCallback(() => {
    setCustomFrom(value.dateFrom)
    setCustomTo(value.dateTo)
  }, [value.dateFrom, value.dateTo])

  const closePanel = useCallback(() => {
    setCustomOpen(false)
    syncDraftFromValue()
  }, [syncDraftFromValue])

  useEffect(() => {
    if (value.preset === 'custom') {
      syncDraftFromValue()
    }
  }, [value, syncDraftFromValue])

  useEffect(() => {
    if (!customOpen || !isDesktop) return

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      const reference = refs.reference.current
      const floating = refs.floating.current
      if (reference instanceof Node && reference.contains(target)) return
      if (floating instanceof Node && floating.contains(target)) return
      if (isInsideDatePickerOverlay(target)) return
      closePanel()
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      if (document.querySelector('.date-picker-popover, .bottom-sheet')) return
      closePanel()
    }

    document.addEventListener('mousedown', handleClickOutside, true)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside, true)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [closePanel, customOpen, isDesktop, refs])

  const selectPreset = useCallback(
    (preset: DatePeriodPreset) => {
      if (preset === 'custom') {
        setCustomOpen((open) => {
          if (open) {
            syncDraftFromValue()
            return false
          }
          syncDraftFromValue()
          return true
        })
        return
      }
      setCustomOpen(false)
      onChange(resolveDatePeriod(preset, undefined, undefined, direction))
    },
    [direction, onChange, syncDraftFromValue]
  )

  const applyCustomRange = useCallback(() => {
    const { from, to } = normalizeRange(customFrom, customTo)
    setCustomFrom(from)
    setCustomTo(to)
    onChange(resolveDatePeriod('custom', from, to, direction))
    setCustomOpen(false)
  }, [customFrom, customTo, direction, onChange])

  const setTriggerRef = useCallback((node: HTMLButtonElement | null) => {
    refs.setReference(node)
  }, [refs])

  const triggerLabel = useMemo(() => {
    let periodLabel: string
    if (value.preset === 'custom') {
      periodLabel = `${formatIsoShort(value.dateFrom)}–${formatIsoShort(value.dateTo)}`
    } else {
      periodLabel = DATE_PERIOD_PRESET_LABELS[value.preset]
    }
    return `Период: ${periodLabel}`
  }, [value.dateFrom, value.dateTo, value.preset])

  const panelBody = (
    <>
      <div className="date-period-filter-panel-presets">
        {panelPresets.map((preset) => (
          <button
            key={preset}
            type="button"
            className={`date-period-filter-panel-chip${value.preset === preset ? ' date-period-filter-panel-chip--active' : ''}`}
            onClick={() => selectPreset(preset)}
          >
            {DATE_PERIOD_PRESET_LABELS[preset]}
          </button>
        ))}
      </div>
      <div className="date-period-filter-panel-fields">
        <DatePicker
          label="От"
          value={customFrom}
          onChange={(event) => setCustomFrom(event.target.value)}
          max={customTo}
          placeholder="Дата начала"
          triggerClassName="date-period-filter-panel-datepicker"
          popoverZIndex={PERIOD_DATE_PICKER_Z_INDEX}
        />
        <DatePicker
          label="До"
          value={customTo}
          onChange={(event) => setCustomTo(event.target.value)}
          min={customFrom}
          placeholder="Дата окончания"
          triggerClassName="date-period-filter-panel-datepicker"
          popoverZIndex={PERIOD_DATE_PICKER_Z_INDEX}
        />
      </div>
      <div className="date-period-filter-panel-actions">
        <Button type="button" size="small" onClick={applyCustomRange}>
          Применить
        </Button>
      </div>
    </>
  )

  return (
    <div className="date-period-filter" role="group" aria-label={ariaLabel}>
      <button
        ref={setTriggerRef}
        type="button"
        className={`date-period-filter-btn date-period-filter-btn--trigger${customOpen ? ' date-period-filter-btn--active' : ''}`}
        onClick={() => selectPreset('custom')}
        aria-expanded={customOpen}
        aria-haspopup="dialog"
      >
        <span className="date-period-filter-btn-label">{triggerLabel}</span>
        <ChevronDown size={16} className="date-period-filter-btn-chevron" aria-hidden="true" />
      </button>

      {customOpen && useSheetPresentation ? (
        <BottomSheet
          isOpen={customOpen}
          onClose={closePanel}
          title="Период"
          overlayZIndex={PERIOD_PANEL_Z_INDEX}
        >
          <div className="date-period-filter-sheet">{panelBody}</div>
        </BottomSheet>
      ) : null}

      {customOpen && !useSheetPresentation
        ? createPortal(
            <div
              ref={refs.setFloating}
              className="date-period-filter-panel"
              style={{
                ...floatingStyles,
                zIndex: PERIOD_PANEL_Z_INDEX,
                opacity: isPositioned ? 1 : 0,
                pointerEvents: isPositioned ? 'auto' : 'none',
              }}
              role="dialog"
              aria-label="Выбор произвольного периода"
            >
              <div className="date-period-filter-panel-head">
                <div className="date-period-filter-panel-title">Период</div>
              </div>
              {panelBody}
            </div>,
            document.body
          )
        : null}
    </div>
  )
}
