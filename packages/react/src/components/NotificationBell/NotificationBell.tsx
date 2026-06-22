import { useState } from 'react'
import './NotificationBell.css'

interface NotificationBellProps {
  count?: number
}

export const NotificationBell = ({ count = 0 }: NotificationBellProps) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="notification-bell-wrapper">
      <button
        className="notification-bell"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notifications"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {count > 0 && <span className="notification-bell-badge">{count}</span>}
      </button>
      {isOpen && (
        <div className="notification-dropdown">
          <div className="notification-dropdown-header">
            <h3>Уведомления</h3>
          </div>
          <div className="notification-dropdown-content">
            <p className="notification-empty">Нет новых уведомлений</p>
          </div>
        </div>
      )}
    </div>
  )
}
