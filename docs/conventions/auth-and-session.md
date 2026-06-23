# Auth & session

This document details how we handle authentication, session persistence, and hydration.

---

## Reference implementations
- [context/auth.tsx](../../src/context/auth.tsx) — The AuthProvider wrapper.
- [store/slices/auth-slice.ts](../../src/store/slices/auth-slice.ts) — Zustand slice holding auth state.

---

## Login flow

1. The user submits the login form on the `/login` route.
2. The form data is sent to `AuthService.login()`.
3. The response is validated at runtime using `LoginResponseSchema.parse(data)`.
4. We verify the user is an admin (`user.type === "admin"`).
5. We call the `signIn(data)` action from `useBoundStore`.
6. The store saves the data to memory and persists it to `localStorage` under the `"auth_data"` key.
7. The user is redirected to `/`.

## Session hydration

When the app loads, the `<AuthProvider>` mounts and calls `hydrateAuth()`.
- It reads `"auth_data"` from `localStorage`.
- It safely parses it using `LoginResponseSchema.safeParse`.
- It checks the token expiration date.
- If valid, it restores the session. If invalid or expired, it clears the storage and forces a logout.

## Token injection

The `api.ts` Axios instance contains a request interceptor.
- It reads the token directly from `localStorage`.
- It injects it into the `Authorization: Bearer <token>` header.

## Rules

1. **Admin only**: The Panel is strictly for admin users. The hydration and login flows must enforce this.
2. **Runtime validation**: Data read from `localStorage` cannot be trusted implicitly. It must be validated via Zod upon hydration.
3. **Zustand owns the state**: The `AuthProvider` is just a thin React wrapper to trigger hydration. The actual state and actions live in `useBoundStore`.

## What NOT to do
- **Don't store tokens in cookies**: The architecture relies on `localStorage` for the Panel.
- **Don't build custom HTTP clients**: Always use the configured Axios instance (`api.ts`) so the interceptors run correctly.
