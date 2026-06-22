# Alert Component

Универсальный компонент для отображения информационных сообщений, предупреждений и ошибок.

## Использование

```tsx
import { Alert } from '@/shared/components/ui/Alert'

// Info (по умолчанию)
<Alert variant="info">
  Информационное сообщение
</Alert>

// Warning
<Alert variant="warning">
  <strong>Важная информация:</strong> Это предупреждение
</Alert>

// Error
<Alert variant="error">
  <strong>Ошибка:</strong> Что-то пошло не так
</Alert>

// Success
<Alert variant="success">
  Операция выполнена успешно
</Alert>
```

## Props

- `variant` (optional): `'info'` | `'warning'` | `'error'` | `'success'` - тип алерта (по умолчанию `'info'`)
- `children`: ReactNode - содержимое алерта
- `className` (optional): string - дополнительные CSS классы

## Стиль

Компонент следует B2B дизайну: спокойные цвета, нейтральный тон, чистая типографика.
Без кричащих элементов и агрессивных предупреждений.

