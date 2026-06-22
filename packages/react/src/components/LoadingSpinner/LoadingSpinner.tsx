import './LoadingSpinner.css'

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large'
  className?: string
}

export const LoadingSpinner = ({ size = 'medium', className = '' }: LoadingSpinnerProps) => {
  return (
    <div className={`loading-spinner loading-spinner-${size} ${className}`}>
      <div className="spinner" />
    </div>
  )
}

