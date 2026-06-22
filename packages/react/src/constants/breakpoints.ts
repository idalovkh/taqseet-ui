/**
 * Единый источник правды для брейкпоинтов.
 * Синхронизировать с @media в CSS (например max-width: 768px).
 */
/** В CSS mobile: max-width 767px; в JS: width < 768 */
export const BREAKPOINT_MOBILE_MAX = 768
export const BREAKPOINT_TABLET_MAX = 1279

export const BREAKPOINTS = {
  mobile: BREAKPOINT_MOBILE_MAX,
  tablet: BREAKPOINT_TABLET_MAX + 1, // 1280
} as const

/** Media queries — синхронизированы с @media в CSS (AppLayout, BottomNav). */
export const MEDIA_MOBILE = `(max-width: ${BREAKPOINT_MOBILE_MAX - 1}px)`
export const MEDIA_TABLET = `(min-width: ${BREAKPOINT_MOBILE_MAX}px) and (max-width: ${BREAKPOINT_TABLET_MAX}px)`
export const MEDIA_DESKTOP = `(min-width: ${BREAKPOINT_TABLET_MAX + 1}px)`

/**
 * Контракт: полноэкранный overlay на мобильном (viewport <= BREAKPOINT_MOBILE_MAX).
 *
 * 1. Viewport: в index.html обязан быть <meta name="viewport" content="..., viewport-fit=cover" />,
 *    иначе env(safe-area-inset-top) не работает на устройствах с вырезом.
 *
 * 2. Overlay (Modal и др.) при открытии в fullscreen-режиме вызывает FullscreenOverlayContext.setActive(true).
 *    Layout (AppLayout) не рендерит app header, когда isActive. Overlay обязан показать способ закрыть.
 *
 * 3. Safe area: index.html имеет viewport-fit=cover и apple-mobile-web-app-status-bar-style=black-translucent.
 */
