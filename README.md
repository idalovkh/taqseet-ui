# taqseet-ui

Shared design system for Taqseet applications.

## Packages

| Package | Description |
|---------|-------------|
| `@idalovkh/taqseet-ui-tokens` | Design tokens, theme overrides, breakpoints |
| `@idalovkh/taqseet-ui-styles` | Global styles and layout utilities |
| `@idalovkh/taqseet-ui-react` | React UI and layout components |

## CSS import order

```ts
import '@idalovkh/taqseet-ui-tokens'
import '@idalovkh/taqseet-ui-styles/globals.css'
```

Tokens must be loaded before globals so CSS variables are available when global styles evaluate.

## Public API contract (`@idalovkh/taqseet-ui-react`)

- Supported runtime entrypoint: `@idalovkh/taqseet-ui-react`
- Supported tooling helper: `@idalovkh/taqseet-ui-react/vite`
- Deep imports to internal source files are not part of the public API and may break without notice.

## Install from GitHub Packages

1. Create a GitHub Personal Access Token with `read:packages` (and `repo` if the package is private).
2. In each consuming app, copy `.npmrc.example` to `.npmrc` and export the token:

```bash
export NODE_AUTH_TOKEN=ghp_...
npm install
```

3. Dependencies in `package.json`:

```json
"@idalovkh/taqseet-ui-react": "^0.1.0",
"@idalovkh/taqseet-ui-styles": "^0.1.0",
"@idalovkh/taqseet-ui-tokens": "^0.1.0"
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
"@idalovkh/taqseet-ui-react": "file:../taqseet-ui/packages/react"
```

## App integration (Vite)

```ts
import { createTaqseetUiAliases } from '@idalovkh/taqseet-ui-react/vite'

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

## Hybrid mode deprecation path

`createTaqseetUiAliases(..., { mode: 'hybrid' })` is migration-only. Keep it temporary and move each app to `mode: 'full'`.

Recommended rollout:

1. Validate one app with `mode: 'full'` in staging.
2. Keep `VITE_UI_LIBRARY=false` as emergency fallback during rollout.
3. Remove `hybrid` from app `vite.config.ts` once parity is confirmed.

## Development

```bash
npm install
npm run build
npm run storybook -w @idalovkh/taqseet-ui-react
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
