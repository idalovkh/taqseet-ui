/**
 * Единый слой форматирования: деньги (копейки), даты и время.
 * Используйте в таблицах и списках short-варианты, в карточках — long.
 */

/** Формат суммы в копейках в рубли с символом валюты (1 234,56 ₽) */
export function formatMoney(kopecks: number | null | undefined): string {
  if (kopecks === null || kopecks === undefined || Number.isNaN(kopecks)) {
    return '—'
  }
  const rubles = kopecks / 100
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(rubles)
}

export const formatCurrency = formatMoney

/**
 * Компактная сумма для узких KPI: от 10 000 ₽ — «тыс», от 1 000 000 ₽ — «млн».
 * Ниже порога — полный formatMoney.
 */
export function formatMoneyCompact(kopecks: number | null | undefined): string {
  if (kopecks === null || kopecks === undefined || Number.isNaN(kopecks)) {
    return '—'
  }

  const rubles = kopecks / 100
  const abs = Math.abs(rubles)
  const sign = rubles < 0 ? '−' : ''

  if (abs < 10_000) {
    return formatMoney(kopecks)
  }

  const formatUnit = (value: number, unit: string) => {
    const str = Math.abs(value).toLocaleString('ru-RU', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 1,
    })
    return `${sign}${str} ${unit}`
  }

  if (abs < 1_000_000) {
    return formatUnit(rubles / 1000, 'тыс ₽')
  }

  return formatUnit(rubles / 1_000_000, 'млн ₽')
}

/** Парсинг строки в копейки */
export function parseMoney(value: string): number {
  const cleaned = value.replace(/[^\d,.-]/g, '')
  const normalized = cleaned.replace(',', '.')
  const rubles = parseFloat(normalized)
  if (isNaN(rubles)) return 0
  return Math.round(rubles * 100)
}

/** Короткая дата для таблиц и списков: ДД.ММ.ГГГГ */
export function formatDateShort(date: Date | string | null | undefined): string {
  if (!date) return '—'
  const d = typeof date === 'string' ? new Date(date) : date
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()
  return `${day}.${month}.${year}`
}

/** Длинная дата для карточек: «1 января 2025 г.» */
export function formatDateLong(date: string | Date | null | undefined): string {
  if (!date) return '—'
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/** Короткая дата-время для таблиц: ДД.ММ.ГГГГ ЧЧ:ММ */
export function formatDateTimeShort(date: Date | string | null | undefined): string {
  if (!date) return '—'
  const d = typeof date === 'string' ? new Date(date) : date
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  return `${day}.${month}.${year} ${hours}:${minutes}`
}

/** Длинная дата-время для карточек */
export function formatDateTimeLong(date: string | Date | null | undefined): string {
  if (!date) return '—'
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/** Для обратной совместимости: в таблицах по умолчанию short */
export const formatDate = formatDateShort
export const formatDateTime = formatDateTimeShort

/** Фамилия + инициалы: «Иванов И. П» (первое слово — фамилия, точка только между инициалами) */
export function formatSurnameAndInitials(fullName: string): string {
  const parts = fullName.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '—'
  if (parts.length === 1) return parts[0]
  const surname = parts[0]
  const letters = parts.slice(1).map((part) => part.charAt(0).toUpperCase())
  const initials = letters
    .map((letter, index) => (index < letters.length - 1 ? `${letter}.` : letter))
    .join(' ')
  return `${surname} ${initials}`.trim()
}
