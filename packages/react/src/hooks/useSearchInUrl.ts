/**
 * useSearchInUrl - поиск, привязанный к query-параметру URL.
 * Сохраняет значение при навигации (например, «Назад» из карточки возвращает тот же поиск).
 * Обновление URL через replace, чтобы не плодить записи в истории при каждом вводе.
 */

import { useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'

const DEFAULT_PARAM = 'search'

export function useSearchInUrl(paramKey: string = DEFAULT_PARAM): [string, (value: string) => void] {
  const [searchParams, setSearchParams] = useSearchParams()
  const value = searchParams.get(paramKey) ?? ''

  const setValue = useCallback(
    (newValue: string) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev)
          if (newValue.trim()) {
            next.set(paramKey, newValue)
          } else {
            next.delete(paramKey)
          }
          return next
        },
        { replace: true }
      )
    },
    [paramKey, setSearchParams]
  )

  return [value, setValue]
}
