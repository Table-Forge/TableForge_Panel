# Routing

This document explains the React Router v7 configuration and route protection.

---

## Reference implementations
- [App.tsx](../../src/App.tsx) — Full route tree and the `ProtectedRoute` guard.
- [components/layout/admin-layout.tsx](../../src/components/layout/admin-layout.tsx) — Authenticated layout rendering `<Outlet>`.
- [store/slices/auth-slice.ts](../../src/store/slices/auth-slice.ts) — Session hydration and the admin-only check.

---

## Route tree

All routes are declared statically in `App.tsx` with `<BrowserRouter>` + `<Routes>`/`<Route>`. There is no separate routes module, no route objects, and no loaders/actions.

- **Public routes**: `/login`, `/recover-password`, `/verify-email`.
- **Protected routes**: a pathless `<Route element={<ProtectedRoute />}>` wraps a pathless `<Route element={<AdminLayout />}>`; both render `<Outlet>`, so every protected page appears inside the admin layout.
  - `index` → `DashboardPage`.
  - List + details pairs: `campaigns`/`campaigns/:id`, `gamesystems`/`gamesystems/:id`, `users`/`users/:id`, `images`/`images/:id`, `logs`/`logs/:id`.
  - List-only: `banners`, `classes`, `races`.
- **Catch-all**: `*` → `<Navigate to="/" replace />`.

The URL segment does not always match the page folder: `/gamesystems` maps to `src/pages/game-systems/`.

Global overlays (`GlobalModal`, `EnvFlag`, `ToastContainer`, and the `#root-portal` div) are mounted once in `App.tsx`, inside `<BrowserRouter>` next to `<Routes>`.

## Route protection

`ProtectedRoute` is a function component defined inside `App.tsx` itself (not a separate file). It reads `isAuthenticated` and `isLoading` from `useAuth()` ([context/use-auth.ts](../../src/context/use-auth.ts)), which is a selector over the Zustand `useBoundStore` — not React context state.

- While `isLoading` (session hydrating): render a full-screen splash ("Carregando sessão...").
- Not authenticated: `<Navigate to="/login" replace />`.
- Authenticated: `<Outlet />`.

Admin-only enforcement happens at session parse time, not per route: `parsePersistedAuth` in [store/slices/auth-slice.ts](../../src/store/slices/auth-slice.ts) discards the persisted session unless the Zod schema parses, the token is unexpired, and `isAdminAuthType(user.type)` passes (case-insensitive `"admin"`, defined in `src/features/auth/schemas/auth.schema.ts`).

`AuthProvider` ([context/auth.tsx](../../src/context/auth.tsx)) only calls `hydrateAuth()` on mount; all auth state lives in the store.

## Navigation

- Sidebar links use `<NavLink>` (`src/components/nav-menu/nav-menu.tsx`).
- Programmatic navigation uses `useNavigate` (e.g. "Voltar" buttons on details pages).
- Listing rows navigate through the shared `<Table>` `detailsLink` prop: pass the listing base path (`detailsLink="/campaigns"`) and the table builds `/{base}/{row.id}`; a function form `detailsLink={(row) => ...}` is also supported.
- After login, `src/pages/login/index.tsx` redirects to `location.state?.from?.pathname` when present, otherwise to `/`.

## Rules

1. **No lazy loading**: every page is statically imported at the top of `App.tsx`. Follow this pattern when registering a new route.
2. **Admin only**: the Panel is strictly for admin users; the auth slice rejects any non-admin session during hydration.
3. **New route = new page folder**: add the page under `src/pages/<feature>/` and register both the list route and the `:id` details route when the feature has a details view.

## What NOT to do
- **Don't fetch data in the router**: no loaders/actions — data fetching is handled at component level via TanStack Query hooks.
- **Don't add per-route role checks or a separate guard file**: the single `ProtectedRoute` in `App.tsx` plus the auth-slice admin check is the whole mechanism.
- **Don't use `<a href>` for internal links**: use `<NavLink>`, `useNavigate`, or the `<Table>` `detailsLink` prop.
