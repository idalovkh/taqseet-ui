/**
 * Утилиты для работы с деньгами
 * Backend работает в копейках (int64), frontend в рублях (number)
 */

/**
 * Конвертирует рубли в копейки
 * Возвращает целое число (int64)
 */
export function rublesToKopecks(rubles: number): number {
  return Math.round(rubles * 100)
}

/**
 * Убеждается, что число является целым (для отправки на backend как int64)
 */
export function ensureInteger(value: number): number {
  return Math.round(value)
}

/**
 * Конвертирует копейки в рубли
 */
export function kopecksToRubles(kopecks: number): number {
  return kopecks / 100
}

/**
 * Форматирует копейки как валюту (рубли с заданным числом знаков после запятой)
 */
export function formatKopecksAsCurrency(kopecks: number, decimals: number = 2): string {
  const rubles = kopecksToRubles(kopecks)
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(rubles)
}

/**
 * Форматирует копейки в рубли с разделителями и символом валюты
 * Используется для плотных таблиц
 */
export function formatMoney(amountInKopecks: number | null | undefined): string {
  if (amountInKopecks === null || amountInKopecks === undefined || isNaN(amountInKopecks)) {
    return '— ₽'
  }
  const rubles = kopecksToRubles(amountInKopecks)
  return `${rubles.toLocaleString('ru-RU', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} ₽`
}

/**
 * Форматирует копейки в рубли с 2 знаками после запятой
 * Формат: 1 250 000,00 ₽
 */
export function formatMoneyRUB(amountInKopecks: number | null | undefined): string {
  if (amountInKopecks === null || amountInKopecks === undefined || isNaN(amountInKopecks)) {
    return '—,00 ₽'
  }
  const rubles = kopecksToRubles(amountInKopecks)
  return `${rubles.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₽`
}

/**
 * Склоняет слово "платеж" в зависимости от количества
 */
export function pluralizePayments(count: number): string {
  const mod10 = count % 10
  const mod100 = count % 100

  if (mod10 === 1 && mod100 !== 11) {
    return 'платеж'
  }
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) {
    return 'платежа'
  }
  return 'платежей'
}

/**
 * Форматирует число с разделителями тысяч для отображения в input
 * Пример: 200000 -> "200 000", 1234.56 -> "1 234.56"
 */
export function formatMoneyInput(value: string | number): string {
  if (!value && value !== 0) return ''
  
  // Убираем все пробелы (разделители тысяч) для парсинга
  const cleaned = String(value).replace(/\s/g, '').replace(',', '.')
  
  // Парсим число
  const num = parseFloat(cleaned)
  
  if (isNaN(num)) {
    // Если не число, возвращаем очищенное значение (для частичного ввода)
    return String(value).replace(/\s/g, '')
  }
  
  // Разделяем целую и дробную части
  const parts = cleaned.split('.')
  const integerPart = parts[0]
  const decimalPart = parts[1]
  
  // Форматируем целую часть с разделителями тысяч
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
  
  // Возвращаем с дробной частью если есть
  return decimalPart !== undefined ? `${formattedInteger}.${decimalPart}` : formattedInteger
}

/**
 * Преобразует отформатированную строку обратно в число (строку для формы)
 * Пример: "200 000" -> "200000", "1 234.56" -> "1234.56"
 */
export function parseMoneyInput(value: string): string {
  if (!value) return ''
  
  // Убираем все пробелы (разделители тысяч) и заменяем запятую на точку
  return value.replace(/\s/g, '').replace(',', '.')
}

