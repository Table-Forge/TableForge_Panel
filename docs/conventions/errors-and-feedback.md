# Errors and feedback

This document explains how we display feedback to the user and handle API errors.

---

## Reference implementations
- [utils/error-handler.ts](../../src/utils/error-handler.ts) — Centralized error parser + toast trigger.
- [store/slices/toast-slice.ts](../../src/store/slices/toast-slice.ts) — Toast state.
- [features/campaigns/hooks/use-campaigns-mutations.ts](../../src/features/campaigns/hooks/use-campaigns-mutations.ts) — Standard error wiring in mutations.

---

## The Toast System

We use a custom, Zustand-backed toast system (no external toast library).
- Types: `"success" | "error" | "info"` (`src/components/toast/toast.interfaces.ts`).
- Inside components/hooks: `const addToast = useBoundStore((state) => state.addToast)`, then `addToast("success", "Campanha salva com sucesso!")`.
- Outside React (e.g. `handleError`): `useBoundStore.getState().addToast(...)`.
- At most 5 toasts are kept (`slice(-5)` in the slice); each auto-dismisses after 3 s, pausing on hover (`src/components/toast/toast.tsx`).
- The `<ToastContainer />` is rendered once in `App.tsx`.

## Handling API Errors

All API errors must funnel through `handleError(error)` in `src/utils/error-handler.ts`. It:

1. Extracts the backend payload from Axios-shaped errors (`error.response?.data ?? error.data ?? error`).
2. Reads `{ Message, Code, Title }` (PascalCase or lowercase variants).
3. Detects HTML responses and replaces the message with "HTML retornado, verifique os logs para mais informações.".
4. Maps status 413 to "Imagem muito grande. O tamanho máximo é de 8 MB (2 MB para avatar).".
5. Falls back to "Ocorreu um erro inesperado" when nothing usable is found.
6. Fires an error toast via `useBoundStore.getState().addToast` and returns an `IError` (`src/interfaces/error.interface.ts`).

## Wiring patterns

**1. Queries — global handler (standard).** `src/main.tsx` sets `QueryCache.onError: (error) => handleError(error)`, so every failed query already produces the error toast. New query hooks need no explicit error handling; list hooks such as `src/features/campaigns/hooks/use-all-campaigns.ts` follow this.

**2. Mutations — local handler.** Pass `handleError` to `onError`:

```ts
useMutation({
  mutationFn: ...,
  onError: (error: Error) => handleError(error),
});
```

**Legacy — `useEffect` + `handleError` inside query hooks.** Existing by-id and enum hooks (e.g. `src/features/campaigns/hooks/use-campaign-by-id.ts`) also call `handleError` inside a `useEffect` watching `query.error`. Combined with the global `QueryCache.onError`, this shows the toast twice. Do not copy this pattern into new hooks.

**Exception — pre-auth flows.** `src/features/auth/hooks/use-auth-mutations.ts` uses a local `getErrorMessage` + `addToast` instead of `handleError`, because login needs message-specific behavior (redirect to `/verify-email`). Keep this confined to auth.

## Rules

1. **Language**: all user-facing error and success messages must be in **pt-BR**, with correct accents.
2. **Use the centralized handler**: never parse Axios error objects manually inside a component; the only sanctioned exception is the auth flow above.
3. **Confirmations use modals, not toasts**: destructive actions go through the modal system (`src/components/modals/modal-delete/`).

## What NOT to do
- **Don't use `window.alert` or `window.confirm`**: always use the Toast system for notifications and the Modal system for confirmations.
- **Don't `console.error` API errors**: `handleError` produces the user feedback (it does not log). The only `console.error` calls in the codebase are in non-API utilities (`src/utils/image.ts`, `src/hooks/utils/use-handle-copy.ts`).
- **Don't add `useEffect` + `handleError` to new query hooks**: the global `QueryCache.onError` already handles them; doubling up duplicates the toast.
