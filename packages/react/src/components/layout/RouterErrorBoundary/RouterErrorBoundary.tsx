import { useEffect } from 'react'
import { isRouteErrorResponse, useRouteError } from 'react-router-dom'
import { Button } from '../../Button'
import {
  isChunkLoadError,
  recoverFromChunkLoadError,
  resetChunkRecoveryGuard,
} from '../../../utils/chunkLoadRecovery'
import '../ErrorBoundary/ErrorBoundary.css'

function getErrorMessage(error: unknown): string {
  if (isRouteErrorResponse(error)) {
    if (typeof error.data === 'string') return error.data
    if (error.data && typeof error.data === 'object' && 'message' in error.data) {
      return String((error.data as { message?: string }).message)
    }
    return error.statusText || 'Произошла ошибка'
  }

  if (error instanceof Error) return error.message
  return 'Произошла непредвиденная ошибка'
}

export function RouterErrorBoundary() {
  const error = useRouteError()
  const message = getErrorMessage(error)

  useEffect(() => {
    if (isChunkLoadError(error)) {
      void recoverFromChunkLoadError()
    }
  }, [error])

  const handleReload = () => {
    resetChunkRecoveryGuard()
    window.location.reload()
  }

  const handleGoHome = () => {
    resetChunkRecoveryGuard()
    window.location.href = '/'
  }

  return (
    <div className="error-boundary">
      <div className="error-boundary-content">
        <h1 className="error-boundary-title">Что-то пошло не так</h1>
        <p className="error-boundary-message">{message}</p>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Button onClick={handleReload} variant="primary">
            Обновить страницу
          </Button>
          <Button onClick={handleGoHome} variant="secondary">
            На главную
          </Button>
        </div>
      </div>
    </div>
  )
}
