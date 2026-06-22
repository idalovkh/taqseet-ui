import './ErrorMessage.css'

interface ErrorMessageProps {
  message: string
  className?: string
}

export const ErrorMessage = ({ message, className = '' }: ErrorMessageProps) => {
  if (!message) return null

  return (
    <div className={`error-message ${className}`}>
      <svg
        className="error-icon"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span>{message}</span>
    </div>
  )
}

