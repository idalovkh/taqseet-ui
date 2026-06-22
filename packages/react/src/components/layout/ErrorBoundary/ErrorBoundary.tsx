import { Component, ErrorInfo, ReactNode } from 'react'
import { Button } from '@/shared/components/ui/Button'
import { isChunkLoadError, recoverFromChunkLoadError } from '@/shared/utils/chunkLoadRecovery'
import './ErrorBoundary.css'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (isChunkLoadError(error)) {
      void recoverFromChunkLoadError()
    }

    // В production можно отправить в Sentry/LogRocket
    // Подготовка для будущей интеграции:
    if (typeof window !== 'undefined' && import.meta.env.PROD) {
      // Сохраняем в sessionStorage для debug
      try {
        const errorLog = {
          message: error.message,
          stack: error.stack,
          componentStack: errorInfo.componentStack?.slice(0, 500), // first 500 chars
          timestamp: new Date().toISOString(),
          url: window.location.href,
        }
        sessionStorage.setItem('last_error', JSON.stringify(errorLog))
      } catch (e) {
        // Ignore storage errors
      }
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="error-boundary">
          <div className="error-boundary-content">
            <h1 className="error-boundary-title">Что-то пошло не так</h1>
            <p className="error-boundary-message">
              {this.state.error?.message || 'Произошла непредвиденная ошибка'}
            </p>
            <Button onClick={this.handleReset} variant="primary">
              Вернуться на главную
            </Button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

