# State management

This document clarifies how we manage client and global state using Zustand.

---

## Reference implementations
- [store/use-bound-store.ts](../../src/store/use-bound-store.ts) — The global composed store.
- [store/use-component-store.ts](../../src/store/use-component-store.ts) — Per-component filter state.

---

## The Stores

We use **Zustand** exclusively for global client state. Server state is handled entirely by TanStack Query.

### 1. `useBoundStore`
A global singleton store composed of multiple slices:
- **AuthSlice**: Manages `authData`, hydration from `localStorage`, `signIn`, and `signOut`.
- **ModalSlice**: Manages a stack-based modal system (`openModal`, `closeModal`).
- **ToastSlice**: Manages the application toast queue.

### 2. `useComponentStore`
A specialized store for persisting UI state (like filters and pagination) keyed by component name. This ensures filters aren't lost when navigating back to a list page.

## Rules

1. **Separation of concerns**: Never store API data or server responses in Zustand. That belongs in TanStack Query.
2. **Outside React**: Zustand allows state access outside of React components via `useBoundStore.getState()`. Use this for global error handlers or interceptors.
3. **Select narrowly**: When consuming the store in a component, select only the specific state or action you need to prevent unnecessary re-renders.
   ```ts
   const openModal = useBoundStore((state) => state.openModal);
   ```

## What NOT to do
- **Don't use Redux or Context API**: Zustand is our chosen global state tool. (Context is only used for a thin `AuthProvider` wrapper).
- **Don't persist unnecessarily**: Only the Auth session should be persisted to `localStorage`. Modals and Toasts should strictly be ephemeral memory state.
