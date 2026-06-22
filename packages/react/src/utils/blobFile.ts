/**
 * PWA-safe helpers for opening, downloading and printing blobs.
 * window.open after async requests is blocked in standalone PWA — use in-app preview instead.
 */

export function shouldUseInAppBlobPreview(): boolean {
  if (typeof window === 'undefined') return false

  const nav = window.navigator as Navigator & { standalone?: boolean }
  const isStandalone =
    window.matchMedia('(display-mode: standalone)').matches || nav.standalone === true

  if (isStandalone) return true

  return window.matchMedia('(hover: none) and (pointer: coarse)').matches
}

export function downloadBlob(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  link.rel = 'noopener noreferrer'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export function openBlobInNewTab(blob: Blob): boolean {
  const url = URL.createObjectURL(blob)
  const newWindow = window.open(url, '_blank', 'noopener,noreferrer')

  if (newWindow) {
    window.setTimeout(() => URL.revokeObjectURL(url), 60_000)
    return true
  }

  URL.revokeObjectURL(url)
  return false
}

export function printHtmlDocument(html: string): boolean {
  const iframe = document.createElement('iframe')
  iframe.setAttribute('aria-hidden', 'true')
  iframe.style.cssText =
    'position:fixed;right:0;bottom:0;width:0;height:0;border:0;opacity:0;pointer-events:none;'

  document.body.appendChild(iframe)

  const win = iframe.contentWindow
  const doc = win?.document
  if (!doc || !win) {
    iframe.remove()
    return false
  }

  doc.open()
  doc.write(html)
  doc.close()

  const cleanup = () => {
    window.setTimeout(() => iframe.remove(), 1000)
  }

  win.addEventListener('afterprint', cleanup, { once: true })
  window.setTimeout(cleanup, 30_000)

  window.requestAnimationFrame(() => {
    win.focus()
    win.print()
  })

  return true
}
