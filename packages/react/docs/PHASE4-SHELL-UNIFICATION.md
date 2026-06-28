# Phase 4 — App shell unification assessment

Status: **deferred epic** (post Phase 0–3). Do not start until admin/invest auth and account shells are stable in production.

## Current state

| App | Shell | Notes |
|-----|-------|-------|
| **manager** | Local `AppLayout` / `AppShell` / rail + bottom-nav + `AppMenu` | Intentionally kept local (`LAYOUT_LOCAL_OVERRIDES` in `vite.shared.js`) |
| **admin** | Local `AppLayout` + sidebar/header | Candidate for shared framework |
| **invest** | Local `AppLayout` + sidebar/header | Near-duplicate of admin pattern |

Shared primitives already extracted: `PageContent`, `ListPageLayout`, `MenuBackLink`, `ProfileIdentityCard`, `AccountMenu`, `AuthPageLayout`, `ErrorBoundary`, settings kit.

## Recommended approach

1. **Unify admin + invest first** — lower navigation variance than manager; shared `AppShell` with props/slots:
   - `sidebar` / `header` slots
   - `navItems` from app config (not in UI package)
   - `profileSlot` for app `ProfileMenu`
2. **Manager stays variant `classic`** until admin/invest shell is proven:
   - rail width, bottom nav, app-menu sheet are manager-specific
   - do not force a single layout component across all three apps
3. **Migration gates**
   - Green type-check + build in admin/invest after each shell PR
   - Smoke: sidebar collapse, mobile header, profile dropdown, list pages, settings routes
   - Manager: regression smoke on bottom-nav + app-menu only when touching shared layout CSS

## Priority order (when epic starts)

1. Extract shared `AppShellFrame` (header + content area + scroll) — no nav config in package
2. Align admin/invest `Header` + `Sidebar` markup/CSS on shared frame
3. Optional: shared `SidebarNav` primitive (items via render props)
4. Evaluate manager convergence only if product requires visual parity

## Out of scope for shell epic

- Route definitions, `ProtectedRoute`, permission guards
- Domain stores, API wiring, org-specific settings layout
- Manager `ExportButton`, `ProfileMenu` menu item logic

## Risk controls

- **High**: mobile nav regressions, z-index/stacking with modals
- **Medium**: alias drift if apps resolve UI from dist vs monorepo source — keep `vite.shared.js` as single alias source
- **Low**: theme/breakpoint — already unified via `@idalovkh/taqseet-ui-react`

See also: `vite.shared.js` → `LAYOUT_LOCAL_OVERRIDES` comment.
