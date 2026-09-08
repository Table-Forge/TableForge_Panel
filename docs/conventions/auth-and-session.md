# Auth & session

This document details how we handle authentication, session persistence, and hydration.

---

## Reference implementations
- [store/slices/auth-slice.ts](../../src/store/slices/auth-slice.ts) — Zustand slice holding auth state, persistence, and hydration.
- [features/api.ts](../../src/features/api.ts) — Axios instance with the token-injection interceptor.
- [features/auth/hooks/use-auth-mutations.ts](../../src/features/auth/hooks/use-auth-mutations.ts) — Login and recovery mutations.

---

## Login flow

1. The user submits the login form on the `/login` route ([pages/login/index.tsx](../../src/pages/login/index.tsx)), built with react-hook-form + `zodResolver(LoginRequestSchema)`.
2. `loginMutation` (from `useAuthMutation()`) calls `AuthService.login()` ([features/auth/services/auth.services.ts](../../src/features/auth/services/auth.services.ts)), which posts to `/users/authenticate` with the credentials as query params (`api.post(..., null, { params: credentials })`).
3. The response is validated at runtime using `LoginResponseSchema.parse(data)`.
4. The mutation verifies the user is an admin via `isAdminAuthType(data.user?.type)` (case-insensitive, from [features/auth/schemas/auth.schema.ts](../../src/features/auth/schemas/auth.schema.ts)) and throws otherwise.
5. On success it calls `signIn(data)` from the `useAuth()` facade ([context/use-auth.ts](../../src/context/use-auth.ts)), which delegates to the `useBoundStore` action.
6. The store saves the data to memory and persists it to `localStorage` under `AUTH_STORAGE_KEY` (`"auth_data"`), exported from the auth slice.
7. When `isAuthenticated` flips, `LoginPage` redirects to `location.state.from.pathname` if present, otherwise `/` (`navigate(..., { replace: true })`).

## Session hydration

When the app loads, `<AuthProvider>` ([context/auth.tsx](../../src/context/auth.tsx)) mounts and calls `hydrateAuth()`.
- It reads `AUTH_STORAGE_KEY` from `localStorage`.
- It safely parses it using `LoginResponseSchema.safeParse`.
- It checks the token expiration date (`token.expiration.getTime() <= Date.now()`).
- It re-checks the admin type with `isAdminAuthType`.
- If valid, it restores the session. If invalid, expired, or non-admin, it removes the key and leaves `authData` as `null`.
- `isLoading` starts as `true` and is set to `false` once hydration finishes.

## Route protection

`ProtectedRoute` in [App.tsx](../../src/App.tsx) wraps all authenticated routes:
- While `isLoading`, it renders a "Carregando sessão..." screen.
- If not authenticated, it redirects to `/login`.
- Public routes are `/login`, `/recover-password`, and `/verify-email`.

## Token injection

The Axios instance in [features/api.ts](../../src/features/api.ts) contains a request interceptor.
- It reads the serialized auth data directly from `localStorage` (not from the store).
- It injects `token.value` into the `Authorization: Bearer <token>` header.
- If the stored JSON fails to parse, it removes the key.

There is no response interceptor (no automatic sign-out on 401) and no refresh-token flow — `signIn` is only called by the login mutation, so the session lasts until the token expires. Global query errors are routed through `handleError` (`src/utils/error-handler.ts`) via `QueryCache.onError` in `src/main.tsx`.

## Sign out

`signOut()` from the `useAuth()` facade delegates to the store action, which removes `AUTH_STORAGE_KEY` from `localStorage` and sets `authData` to `null`. The only caller today is the header ([components/header/header.tsx](../../src/components/header/header.tsx)): it asks for confirmation in a modal ("Confirmar saída") and, on confirm, calls `signOut()` and navigates to `/login` with `replace: true`. The facade also calls `queryClient.clear()`, so no cached server data survives the session.

## Rules

1. **Admin only**: The Panel is strictly for admin users. Both the login mutation and hydration enforce this via `isAdminAuthType` — use that helper, never compare `user.type` by hand.
2. **Runtime validation**: Data read from `localStorage` cannot be trusted implicitly. It must be validated via Zod upon hydration.
3. **Zustand owns the state**: The `AuthProvider` is just a thin React wrapper to trigger hydration (it creates no Context). The actual state and actions live in `useBoundStore`; components consume them through `useAuth()`.
4. **Single storage key**: Always import `AUTH_STORAGE_KEY` from the auth slice (re-exported by `src/store/index.ts`) instead of hardcoding `"auth_data"`.

## What NOT to do
- **Don't store tokens in cookies**: The architecture relies on `localStorage` for the Panel.
- **Don't build custom HTTP clients**: Always use the configured Axios instance (`src/features/api.ts`) so the interceptor runs correctly.
- **Don't select auth fields from the store in components**: Go through `useAuth()`; direct selects like `useBoundStore((s) => s.authData?.user?.id)` exist in a few legacy modals (e.g. `src/pages/users/components/modal-edit/modal-edit.tsx`) but are not the pattern to copy.
