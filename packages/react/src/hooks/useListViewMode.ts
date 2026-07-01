import { useMemo } from 'react'
import { useLocalStorage } from './useLocalStorage'

export type ListViewMode = 'table' | 'cards'

const LIST_VIEW_MODES: ListViewMode[] = ['table', 'cards']

function isListViewMode(value: unknown): value is ListViewMode {
  return typeof value === 'string' && LIST_VIEW_MODES.includes(value as ListViewMode)
}

export function useListViewMode(scope: string, defaultMode: ListViewMode = 'table') {
  const storageKey = `${scope}-list-view-mode`
  const [rawMode, setRawMode] = useLocalStorage<ListViewMode | string>(storageKey, defaultMode)
  const mode: ListViewMode = isListViewMode(rawMode) ? rawMode : defaultMode

  return useMemo(
    () => ({
      mode,
      setMode: (nextMode: ListViewMode) => setRawMode(nextMode),
      toggleMode: () => setRawMode(mode === 'table' ? 'cards' : 'table'),
      storageKey,
      isTable: mode === 'table',
      isCards: mode === 'cards',
    }),
    [mode, setRawMode, storageKey]
  )
}
