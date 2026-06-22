function isoFromDayMonthYear(dayRaw: string, monthRaw: string, year: string): string | null {
  const day = dayRaw.padStart(2, '0')
  const month = monthRaw.padStart(2, '0')
  const date = new Date(Number(year), Number(month) - 1, Number(day))

  if (Number.isNaN(date.getTime()) || date.getDate() !== Number(day)) {
    return null
  }

  return `${year}-${month}-${day}`
}

/** Форматирует ввод цифр в ДД.ММ.ГГГГ по мере набора */
export function formatDateInputMask(input: string): string {
  const digits = input.replace(/\D/g, '').slice(0, 8)
  if (digits.length <= 2) return digits
  if (digits.length <= 4) return `${digits.slice(0, 2)}.${digits.slice(2)}`
  return `${digits.slice(0, 2)}.${digits.slice(2, 4)}.${digits.slice(4)}`
}

/** Parse DD.MM.YYYY, DD-MM-YYYY, DD/MM/YYYY, DDMMYYYY → YYYY-MM-DD */
export function parseFlexibleDate(input: string): string | null {
  const trimmed = input.trim()
  const separated = trimmed.match(/^(\d{1,2})[.\-/](\d{1,2})[.\-/](\d{4})$/)
  if (separated) {
    return isoFromDayMonthYear(separated[1], separated[2], separated[3])
  }

  const digitsOnly = trimmed.replace(/\D/g, '')
  if (/^\d{8}$/.test(digitsOnly)) {
    return isoFromDayMonthYear(
      digitsOnly.slice(0, 2),
      digitsOnly.slice(2, 4),
      digitsOnly.slice(4, 8)
    )
  }

  return null
}

export function isoToDate(iso: string | undefined): Date | undefined {
  if (!iso) return undefined
  const match = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (!match) return undefined

  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])
  const date = new Date(year, month - 1, day)

  if (
    Number.isNaN(date.getTime()) ||
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return undefined
  }

  return date
}

export function dateToIso(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function formatDateDisplay(iso: string | undefined): string {
  const date = isoToDate(iso)
  if (!date) return ''

  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date)
}
