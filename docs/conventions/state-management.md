# State management

This document clarifies how we manage client and global state using Zustand.

---

## Reference implementations
- [store/use-bound-store.ts](../../src/store/use-bound-store.ts) — The global composed store.
- [store/slices/auth-slice.ts](../../src/store/slices/auth-slice.ts) — Slice pattern (state + actions, typed via `SliceCreator`).
- [store/use-component-store.ts](../../src/store/use-component-store.ts) — Per-component filter state.

---

## The stores

We use **Zustand** exclusively for global client state. Server state is handled entirely by TanStack Query.

### 1. `useBoundStore`
A global singleton store composed of slices living in [src/store/slices/](../../src/store/slices):
- **AuthSlice** (`auth-slice.ts`): `authData`, `isLoading`, `hydrateAuth` (restores from `localStorage`), `signIn`, `signOut`.
- **ModalSlice** (`modal-slice.ts`): stack-based modal system — a `modals` array plus `openModal`/`closeModal` (closing pops the top of the stack).
- **ToastSlice** (`toast-slice.ts`): toast queue capped at the last 5 — `addToast`, `removeToast`, `clearToasts`.

Slice contracts live in [store/types.ts](../../src/store/types.ts): each slice interface is merged into `BoundStore`, and slice creators are typed as `SliceCreator<TSlice>`. New slices follow this pattern and are spread into `create<BoundStore>()` in `use-bound-store.ts`. The public entry point is [store/index.ts](../../src/store/index.ts), which re-exports both stores, `AUTH_STORAGE_KEY`, and the slice types.

### 2. `useComponentStore`
An in-memory store persisting UI state (filters and pagination) keyed by a per-screen string. This ensures filters aren't lost when navigating back to a list page. It is consumed through per-feature list hooks, e.g. [features/users/hooks/use-all-users.ts](../../src/features/users/hooks/use-all-users.ts): each hook defines its own key (`USERS_COMPONENT_FILTER_KEY = "users"`) and initial filters, and returns `filters`, `setFilters`, `resetFilters`, and a debounced `onSearchChange` alongside the TanStack Query result.

## Rules

1. **Separation of concerns**: Never store API data or server responses in Zustand. That belongs in TanStack Query.
2. **Outside React**: Zustand allows state access outside of React components via `useBoundStore.getState()`. Real example: `handleError` in [utils/error-handler.ts](../../src/utils/error-handler.ts) grabs `addToast` this way. (The Axios request interceptor in [features/api.ts](../../src/features/api.ts) intentionally reads `localStorage` directly instead of the store — see [auth-and-session.md](./auth-and-session.md).)
3. **Select narrowly**: When consuming the store in a component, select only the specific state or action you need to prevent unnecessary re-renders.
   ```ts
   const openModal = useBoundStore((state) => state.openModal);
   ```
4. **Auth via facade**: Components consume auth state through the `useAuth()` hook in [context/use-auth.ts](../../src/context/use-auth.ts) (`authData`, `user`, `isAuthenticated`, `isLoading`, `signIn`, `signOut`) rather than selecting auth fields from the store directly.

## What NOT to do
- **Don't use Redux or React Context for global state**: Zustand is our chosen global state tool. `AuthProvider` (`src/context/auth.tsx`) is not a Context — it only triggers hydration on mount. The one real Context in the codebase is component-local wiring for a compound component (`src/components/filters/filters.context.ts`), which is acceptable at that scope.
- **Don't persist unnecessarily**: Only the Auth session is persisted to `localStorage` (under `AUTH_STORAGE_KEY`). Modals, toasts, and component filters are strictly ephemeral in-memory state.
