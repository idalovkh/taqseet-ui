import path from 'node:path'
import { fileURLToPath } from 'node:url'
import fs from 'node:fs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const reactRoot = path.resolve(__dirname, 'src')
const tokensRoot = path.resolve(__dirname, '../tokens/src')
const stylesRoot = path.resolve(__dirname, '../styles/src')

const MANAGER_LOCAL_OVERRIDES = [
  'ProfileMenu',
  'ExportButton',
  'GenderSelect',
]

const LAYOUT_LOCAL_OVERRIDES = [
  'SectionHubGrid',
  'RouterErrorBoundary',
  'AppLayout',
  'AppShell',
  'Sidebar',
  'Header',
  'BottomNav',
  'ProtectedRoute',
  'AppMenu',
  'navigation',
]

const MOVED_LAYOUT = [
  'PageContent',
  'PageTitleRow',
  'FlowPage',
  'ListPageLayout',
  'ListPageDesktopToolbar',
  'ListPageToolbarSearchRow',
  'ListPageCreateButton',
  'ListPageToolbarBelowSummary',
  'MenuBackLink',
  'ProfileIdentityCard',
  'ErrorBoundary',
]

const MOVED_HOOKS = [
  'useBreakpoint',
  'useDebounce',
  'useHorizontalSnapCarousel',
  'useInfiniteListPage',
  'useInfiniteScrollTrigger',
  'useListKpiLabels',
  'useListPageCompactLayout',
  'useLocalStorage',
  'useMaxWidth',
  'useMenuBackLink',
  'usePaginationState',
  'useSearchInUrl',
  'useTheme',
]

function exists(targetPath) {
  return fs.existsSync(targetPath)
}

function applyHybridComponentAliases(aliases, localShared) {
  const localUiPath = path.resolve(localShared, 'components/ui')
  if (exists(localUiPath)) {
    for (const name of fs.readdirSync(localUiPath)) {
      const fullPath = path.join(localUiPath, name)
      if (fs.statSync(fullPath).isDirectory()) {
        aliases[`@/shared/components/ui/${name}`] = fullPath
      }
    }
  }

  const libraryUiPath = path.resolve(reactRoot, 'components')
  for (const name of fs.readdirSync(libraryUiPath)) {
    const key = `@/shared/components/ui/${name}`
    if (!aliases[key]) {
      const fullPath = path.join(libraryUiPath, name)
      if (fs.statSync(fullPath).isDirectory()) {
        aliases[key] = fullPath
      }
    }
  }
}

function applyLibrarySupportAliases(aliases) {
  aliases['@/shared/contexts'] = path.resolve(reactRoot, 'contexts')
  aliases['@/shared/providers'] = path.resolve(reactRoot, 'providers')
  aliases['@/shared/config/support.config'] = path.resolve(reactRoot, 'config/support.config.ts')

  for (const name of MOVED_HOOKS) {
    aliases[`@/shared/hooks/${name}`] = path.resolve(reactRoot, 'hooks', `${name}.ts`)
  }

  const movedUtils = [
    'dateInput',
    'datePeriod',
    'money',
    'toast',
    'blobFile',
    'formatters',
    'chunkLoadRecovery',
  ]
  for (const name of movedUtils) {
    aliases[`@/shared/utils/${name}`] = path.resolve(reactRoot, 'utils', `${name}.ts`)
  }

  aliases['@/shared/constants/breakpoints'] = path.resolve(reactRoot, 'constants/breakpoints.ts')
}

/** @typedef {{ mode?: 'styles-only' | 'hybrid' | 'full' }} TaqseetUiAliasOptions */

/** Vite/TS path aliases for consuming apps (manager, auth, invest, admin). */
export function createTaqseetUiAliases(appRoot, options = {}) {
  const mode = options.mode ?? 'full'
  const localShared = path.resolve(appRoot, 'src/shared')

  const aliases = {
    '@idalovkh/taqseet-ui-tokens': path.resolve(tokensRoot, 'index.css'),
    '@idalovkh/taqseet-ui-styles/globals.css': path.resolve(stylesRoot, 'globals.css'),
    '@idalovkh/taqseet-ui-styles': stylesRoot,
    '@idalovkh/taqseet-ui-react': path.resolve(__dirname, 'src/index.ts'),
  }

  if (mode === 'styles-only') {
    return aliases
  }

  if (mode === 'hybrid') {
    applyHybridComponentAliases(aliases, localShared)
    applyLibrarySupportAliases(aliases)
    return aliases
  }

  for (const name of MANAGER_LOCAL_OVERRIDES) {
    const localPath = path.resolve(localShared, 'components/ui', name)
    if (exists(localPath)) {
      aliases[`@/shared/components/ui/${name}`] = localPath
    }
  }

  const localHook = path.resolve(localShared, 'hooks/usePermission.ts')
  if (exists(localHook)) {
    aliases['@/shared/hooks/usePermission'] = localHook
  }

  const localMenuBack = path.resolve(localShared, 'config/menuBackNavigation.ts')
  if (exists(localMenuBack)) {
    aliases['@/shared/config/menuBackNavigation'] = localMenuBack
  }

  for (const name of LAYOUT_LOCAL_OVERRIDES) {
    const localPath = path.resolve(localShared, 'components/layout', name)
    if (exists(localPath)) {
      aliases[`@/shared/components/layout/${name}`] = localPath
    }
  }

  for (const name of MOVED_LAYOUT) {
    aliases[`@/shared/components/layout/${name}`] = path.resolve(reactRoot, 'components/layout', name)
  }

  aliases['@/shared/components/ui'] = path.resolve(reactRoot, 'components')
  applyLibrarySupportAliases(aliases)

  return aliases
}
