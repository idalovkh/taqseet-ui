import React from 'react'
import { MoreVertical } from 'lucide-react'
import './ActionsMenuTrigger.css'

interface ActionsMenuTriggerProps {
  /** Дополнительный класс для контекста (таблица, карточка и т.д.) */
  className?: string
  /** Обработчик клика (например, e.stopPropagation() для строк таблицы) */
  onClick?: (e: React.MouseEvent) => void
  /** Доступное описание для скринридеров */
  'aria-label'?: string
}

/**
 * Общая кнопка «Действия» (три точки) для вызова контекстного меню.
 * Используется как trigger для DropdownMenu на всех страницах.
 */
export const ActionsMenuTrigger: React.FC<ActionsMenuTriggerProps> = ({
  className,
  onClick,
  'aria-label': ariaLabel = 'Действия',
}) => (
  <button
    type="button"
    className={`actions-menu-trigger ${className ?? ''}`.trim()}
    aria-label={ariaLabel}
    onClick={onClick}
  >
    <MoreVertical size={18} aria-hidden />
  </button>
)
