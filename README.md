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

## Install from GitHub Packages

1. Create a GitHub Personal Access Token with `read:packages` (and `repo` if the package is private).
2. In each consuming app, copy `.npmrc.example` to `.npmrc` and export the token:

```bash
export NODE_AUTH_TOKEN=ghp_...
npm install
```

3. Dependencies in `package.json`:

```json
"@taqseet-ui/react": "^0.1.0",
"@taqseet-ui/styles": "^0.1.0",
"@taqseet-ui/tokens": "^0.1.0"
```

## Publish new versions

Push a tag `v0.1.1` or run the **Publish** workflow manually in GitHub Actions.

```bash
git tag v0.1.1
git push origin v0.1.1
```

Before the first install, run **Publish** once so packages exist in the registry.

## Local development (without registry)

Clone `taqseet-ui` next to the app and use file dependencies:

```json
"@taqseet-ui/react": "file:../taqseet-ui/packages/react"
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

## Visual regression (Playwright)

CI runs on **Linux** (`ubuntu-latest`). Snapshots are stored per platform:

- `*-chromium-linux.png` — used in GitHub Actions
- `*-chromium-darwin.png` — used on macOS locally

After changing UI, refresh Linux baselines (same Docker image as CI):

```bash
npm run test:visual:update:linux
```

CI runs visual tests inside `mcr.microsoft.com/playwright:v1.49.1-jammy` so snapshots match the runner environment.

Then commit updated files under `packages/react/tests/visual/components.spec.ts-snapshots/`.
