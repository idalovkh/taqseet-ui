import { useEffect, useState } from 'react'

export function useMaxWidth(maxWidthPx: number): boolean {
  const query = `(max-width: ${maxWidthPx}px)`

  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia(query).matches
  })

  useEffect(() => {
    const mql = window.matchMedia(query)
    const sync = () => setMatches(mql.matches)
    sync()
    mql.addEventListener('change', sync)
    return () => mql.removeEventListener('change', sync)
  }, [query])

  return matches
}
