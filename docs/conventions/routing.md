# Routing

This document explains the React Router v7 configuration and route protection.

---

## Reference implementations
- [App.tsx](../../src/App.tsx) — Router definition.
- [components/layout/admin-layout.tsx](../../src/components/layout/admin-layout.tsx) — Main authenticated layout.

---

## Route tree

We use a declarative `<Routes>` and `<Route>` setup in `BrowserRouter`.

- **Public routes**: `/login`, `/recover-password`.
- **Protected routes**: Wrapped by `<ProtectedRoute>`, rendering the `<AdminLayout>`.
  - `/` -> Dashboard
  - `/campaigns`, `/users`, etc.
- **Catch-all**: `*` redirects to `/`.

## Route protection

The `<ProtectedRoute>` component acts as a guard. It reads the `isAuthenticated` state from the auth context.

- If the session is still loading/hydrating: Show a loading splash screen.
- If not authenticated: Redirect to `/login`.
- If authenticated: Render the children (`<Outlet>`).

## Rules

1. **Lazy loading**: Page components should generally be lazy-loaded to optimize bundle size.
2. **Admin only**: The Panel is strictly for admin users. The hydration logic verifies `user.type === "admin"`.
3. **Links**: Use React Router's `<Link>` or `useNavigate` for client-side transitions.

## What NOT to do
- **Don't hardcode redirects**: Use constant paths or dynamic parameter generation helpers.
- **Don't fetch data in the router**: Data fetching is handled at the component level via TanStack Query, not in route loaders (at least in the current architecture).
