export type DatePeriodPreset = 'all' | 'today' | 'week' | 'month' | 'quarter' | 'year' | 'custom'

/** past — от начала периода до сегодня; future — от сегодня до конца периода */
export type DatePeriodDirection = 'past' | 'future'

export interface DatePeriod {
  preset: DatePeriodPreset
  dateFrom: string
  dateTo: string
}

function formatIsoDate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function startOfWeek(date: Date): Date {
  const result = new Date(date)
  const day = result.getDay()
  const diff = day === 0 ? -6 : 1 - day
  result.setDate(result.getDate() + diff)
  result.setHours(0, 0, 0, 0)
  return result
}

function startOfQuarter(date: Date): Date {
  const quarterMonth = Math.floor(date.getMonth() / 3) * 3
  return new Date(date.getFullYear(), quarterMonth, 1)
}

function endOfWeek(date: Date): Date {
  const end = startOfWeek(date)
  end.setDate(end.getDate() + 6)
  return end
}

function endOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0)
}

function endOfQuarter(date: Date): Date {
  const quarterMonth = Math.floor(date.getMonth() / 3) * 3
  return new Date(date.getFullYear(), quarterMonth + 3, 0)
}

function endOfYear(date: Date): Date {
  return new Date(date.getFullYear(), 11, 31)
}

export function resolveDatePeriod(
  preset: DatePeriodPreset,
  customFrom?: string,
  customTo?: string,
  direction: DatePeriodDirection = 'past'
): DatePeriod {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayIso = formatIsoDate(today)

  if (preset === 'all') {
    return {
      preset: 'all',
      dateFrom: '',
      dateTo: '',
    }
  }

  if (preset === 'custom') {
    return {
      preset,
      dateFrom: customFrom ?? todayIso,
      dateTo: customTo ?? todayIso,
    }
  }

  if (direction === 'future') {
    let to = new Date(today)
    switch (preset) {
      case 'today':
        break
      case 'week':
        to = endOfWeek(today)
        break
      case 'month':
        to = endOfMonth(today)
        break
      case 'quarter':
        to = endOfQuarter(today)
        break
      case 'year':
        to = endOfYear(today)
        break
    }

    return {
      preset,
      dateFrom: todayIso,
      dateTo: formatIsoDate(to),
    }
  }

  let from = new Date(today)
  switch (preset) {
    case 'today':
      break
    case 'week':
      from = startOfWeek(today)
      break
    case 'month':
      from = new Date(today.getFullYear(), today.getMonth(), 1)
      break
    case 'quarter':
      from = startOfQuarter(today)
      break
    case 'year':
      from = new Date(today.getFullYear(), 0, 1)
      break
  }

  return {
    preset,
    dateFrom: formatIsoDate(from),
    dateTo: todayIso,
  }
}

export function getDefaultDatePeriod(direction: DatePeriodDirection = 'past'): DatePeriod {
  return resolveDatePeriod('month', undefined, undefined, direction)
}

export function buildDateRangeQuery(period: DatePeriod): string {
  if (period.preset === 'all' || !period.dateFrom || !period.dateTo) {
    return ''
  }
  const params = new URLSearchParams({
    dateFrom: period.dateFrom,
    dateTo: period.dateTo,
  })
  return params.toString()
}

export function isDatePeriodActive(period: DatePeriod): boolean {
  return period.preset !== 'all' && Boolean(period.dateFrom && period.dateTo)
}

export const DATE_PERIOD_PRESET_LABELS: Record<DatePeriodPreset, string> = {
  all: 'Всё время',
  today: 'Сегодня',
  week: 'Неделя',
  month: 'Месяц',
  quarter: 'Квартал',
  year: 'Год',
  custom: 'Период',
}

export function formatDatePeriodLabel(period: DatePeriod): string {
  if (period.preset === 'all') {
    return DATE_PERIOD_PRESET_LABELS.all
  }
  if (period.preset !== 'custom') {
    return DATE_PERIOD_PRESET_LABELS[period.preset]
  }
  if (period.dateFrom === period.dateTo) {
    return period.dateFrom
  }
  return `${period.dateFrom} — ${period.dateTo}`
}
