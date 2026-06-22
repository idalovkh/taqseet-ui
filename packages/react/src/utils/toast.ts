import toast from 'react-hot-toast'

/**
 * Toast notification utilities using react-hot-toast
 * Provides a consistent API for displaying notifications throughout the app
 */
export const showToast = {
  success: (message: string) => {
    toast.success(message, {
      duration: 4000,
      position: 'top-right',
      style: {
        background: 'var(--color-surface)',
        color: 'var(--color-text-primary)',
        border: '1px solid var(--color-success)',
      },
    })
  },

  error: (message: string) => {
    toast.error(message, {
      duration: 5000,
      position: 'top-right',
      style: {
        background: 'var(--color-surface)',
        color: 'var(--color-text-primary)',
        border: '1px solid var(--color-danger)',
      },
    })
  },

  info: (message: string) => {
    toast(message, {
      icon: 'ℹ️',
      duration: 4000,
      position: 'top-right',
      style: {
        background: 'var(--color-surface)',
        color: 'var(--color-text-primary)',
        border: '1px solid var(--color-border)',
      },
    })
  },

  warning: (message: string) => {
    toast(message, {
      icon: '⚠️',
      duration: 4000,
      position: 'top-right',
      style: {
        background: 'var(--color-surface)',
        color: 'var(--color-text-primary)',
        border: '1px solid var(--color-warning)',
      },
    })
  },

  loading: (message: string) => {
    return toast.loading(message, {
      position: 'top-right',
      style: {
        background: 'var(--color-surface)',
        color: 'var(--color-text-primary)',
        border: '1px solid var(--color-border)',
      },
    })
  },

  // Для закрытия loading тоста
  dismiss: (toastId: string) => {
    toast.dismiss(toastId)
  },

  // Закрыть все тосты
  dismissAll: () => {
    toast.dismiss()
  },
}

// Обратная совместимость и прямой доступ к toast API
export { toast }
export default showToast
