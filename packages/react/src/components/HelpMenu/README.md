# HelpMenu Component

Компонент меню "Помощь" в верхней панели приложения.

## Описание

Минималистичное dropdown-меню с доступом к документации, поддержке и контактной информации.

## Структура

```
HelpMenu/
├── HelpMenu.tsx       # Основной компонент
├── HelpMenu.css       # Стили
├── index.ts           # Экспорт
└── README.md          # Документация
```

## Использование

```tsx
import { HelpMenu } from '@/shared/components/ui/HelpMenu'

// В Header
<HelpMenu />
```

## Конфигурация

URLs и контакты настраиваются в `src/shared/config/support.config.ts`:

```typescript
export const SUPPORT_CONFIG = {
  DOCS_URL: 'https://docs.taqseet.com',
  SUPPORT_TG_USERNAME: 'taqseet_support',
  SUPPORT_TG_URL: 'https://t.me/taqseet_support',
  SUPPORT_PHONE: '8 (800) 700-32-92',
  SUPPORT_PHONE_TEL: '88007003292',
}
```

## Функциональность

### Пункты меню

1. **Документация** (иконка документа)
   - Открывается в новой вкладке
   - URL: `SUPPORT_CONFIG.DOCS_URL`

2. **Написать в поддержку** (иконка чата)
   - Открывается Telegram в новой вкладке
   - URL: `SUPPORT_CONFIG.SUPPORT_TG_URL`

3. **Контакты** (footer-блок, не item)
   - Телефон: `SUPPORT_CONFIG.SUPPORT_PHONE`
   - На mobile: кликабельная ссылка `tel:`
   - На desktop: просто текст (без hover)

### Поведение

- Открытие: клик по иконке наушников
- Закрытие:
  - Клик вне меню
  - Нажатие Escape
  - Клик по пункту меню
- Позиция: anchor top-right (привязан к кнопке)

## UI/UX

### Размеры

- Ширина dropdown: 300px (280px на mobile)
- Высота item: 46px
- Иконки: 18-20px
- Padding: 12-16px

### Стиль

- Повторяет дизайн других dropdown в проекте
- Использует CSS-переменные проекта
- Адаптивный дизайн для mobile

## Acceptance Criteria

### ✅ Функциональные требования

- [ ] Иконка наушников отображается в header справа, между SearchInput и NotificationBell
- [ ] По клику на иконку открывается dropdown
- [ ] Dropdown закрывается при клике вне области
- [ ] Dropdown закрывается при нажатии Escape
- [ ] Dropdown закрывается при клике на пункт меню
- [ ] Пункт "Документация" открывает URL в новой вкладке
- [ ] Пункт "Написать в поддержку" открывает Telegram в новой вкладке
- [ ] Телефон кликабелен на mobile (tel: ссылка)
- [ ] Телефон НЕ кликабелен на desktop (просто текст)

### ✅ UI требования

- [ ] Dropdown имеет правильные размеры (300px ширина)
- [ ] Items имеют высоту ~46px
- [ ] Иконки 18-20px
- [ ] Hover эффект на items
- [ ] Divider между пунктами и footer
- [ ] Footer имеет отдельный фон (bg-layout)
- [ ] Адаптивная ширина на mobile (280px)

### ✅ Технические требования

- [ ] URLs вынесены в конфиг (`support.config.ts`)
- [ ] Нет TypeScript ошибок
- [ ] Нет ESLint ошибок
- [ ] Компонент экспортируется через index.ts
- [ ] Используются CSS-переменные проекта
- [ ] Accessibility: aria-label, aria-expanded

### ✅ Тестирование

- [ ] Открытие/закрытие dropdown работает
- [ ] Escape закрывает dropdown
- [ ] Click outside закрывает dropdown
- [ ] Ссылки имеют правильные href
- [ ] Ссылки открываются в новой вкладке (target="_blank")
- [ ] Телефон работает на mobile
- [ ] Телефон не кликабелен на desktop

## Примечания

### Что НЕ включено (по требованию)

- ❌ "Центр поддержки"
- ❌ "Новости платформы"
- ❌ "Статус сервисов"
- ❌ Зелёные точки/статусные индикаторы
- ❌ Избыточные отступы

### Будущие улучшения (v2)

- Добавить аналитику кликов
- Добавить "Горячие клавиши" (?)
- Добавить "Обратная связь" (feedback form)
- Интеграция с Intercom/Crisp

