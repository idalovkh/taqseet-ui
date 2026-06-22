import type { BadgeVariant } from '../Badge'

export interface StatusDisplay {
  label: string
  variant: BadgeVariant
  strikethrough?: boolean
}

const STATUS_CONFIG: Record<string, StatusDisplay> = {
  // Payment / schedule statuses
  paid: { label: 'Оплачен', variant: 'success' },
  partial: { label: 'Частично', variant: 'warning' },
  overdue: { label: 'Просрочен', variant: 'danger' },
  pending: { label: 'Ожидается', variant: 'default' },
  expected: { label: 'Ожидается', variant: 'default' },
  cancelled: { label: 'Отменён', variant: 'default', strikethrough: true },

  // Agreement / entity statuses
  active: { label: 'Активный', variant: 'success' },
  completed: { label: 'Завершён', variant: 'info' },
  draft: { label: 'Черновик', variant: 'default' },
  terminated: { label: 'Расторгнут', variant: 'default' },
  archived: { label: 'Архив', variant: 'default' },

  // Invitations / employees
  inactive: { label: 'Неактивный', variant: 'default' },
  invited: { label: 'Приглашён', variant: 'info' },
  expired: { label: 'Истёк', variant: 'warning' },
  accepted: { label: 'Принято', variant: 'success' },
}

export function getStatusDisplay(status: string): StatusDisplay {
  const key = status.trim().toLowerCase()
  return STATUS_CONFIG[key] ?? { label: status, variant: 'default' }
}

export function getStatusLabel(status: string): string {
  return getStatusDisplay(status).label
}
