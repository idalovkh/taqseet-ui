# taqseet-ui

Shared design system for Taqseet applications.

## Packages

| Package | Description |
|---------|-------------|
| `@taqseet-ui/tokens` | Design tokens, theme overrides, breakpoints |
| `@taqseet-ui/styles` | Global styles and layout utilities |
| `@taqseet-ui/react` | React UI and layout components |

## CSS import order

```ts
import '@taqseet-ui/styles/globals.css'
```

## App integration (Vite)

```ts
import { createTaqseetUiAliases } from '@taqseet-ui/react/vite'

export default defineConfig({
  resolve: {
    alias: {
      ...createTaqseetUiAliases(__dirname),
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

## Fallback during rollout

Set `VITE_UI_LIBRARY=false` to use local styles/components while migrating:

```ts
const useLibrary = import.meta.env.VITE_UI_LIBRARY !== 'false'
```

## Development

```bash
npm install
npm run build
npm run storybook -w @taqseet-ui/react
```
