const RELOAD_GUARD_KEY = 'chunk_recovery_attempted'

export function isChunkLoadError(error: unknown): boolean {
  const message =
    error instanceof Error
      ? error.message
      : typeof error === 'string'
        ? error
        : String(error ?? '')

  const normalized = message.toLowerCase()
  return (
    normalized.includes('importing a module script failed') ||
    normalized.includes('failed to fetch dynamically imported module') ||
    normalized.includes('chunkloaderror') ||
    normalized.includes('loading chunk') ||
    normalized.includes('dynamically imported module')
  )
}

export async function clearAppCaches(): Promise<void> {
  if (typeof window === 'undefined') return

  try {
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations()
      await Promise.all(registrations.map((registration) => registration.unregister()))
    }

    if ('caches' in window) {
      const cacheKeys = await caches.keys()
      await Promise.all(cacheKeys.map((key) => caches.delete(key)))
    }
  } catch {
    // Ignore cleanup errors.
  }
}

export async function recoverFromChunkLoadError(): Promise<boolean> {
  if (typeof window === 'undefined') return false
  if (!import.meta.env.PROD) return false

  if (sessionStorage.getItem(RELOAD_GUARD_KEY) === '1') return false
  sessionStorage.setItem(RELOAD_GUARD_KEY, '1')

  await clearAppCaches()
  window.location.reload()
  return true
}

export function resetChunkRecoveryGuard(): void {
  sessionStorage.removeItem(RELOAD_GUARD_KEY)
}

export function initChunkLoadRecovery(): void {
  if (typeof window === 'undefined' || !import.meta.env.PROD) return

  const handleChunkError = (error: unknown) => {
    if (!isChunkLoadError(error)) return
    void recoverFromChunkLoadError()
  }

  window.addEventListener('unhandledrejection', (event) => {
    handleChunkError(event.reason)
  })

  window.addEventListener('error', (event) => {
    handleChunkError(event.error ?? event.message)
  })
}
