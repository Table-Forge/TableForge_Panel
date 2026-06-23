# Errors and feedback

This document explains how we display feedback to the user and handle API errors.

---

## Reference implementations
- [utils/error-handler.ts](../../src/utils/error-handler.ts) — Centralized error parser.
- [store/slices/toast-slice.ts](../../src/store/slices/toast-slice.ts) — Toast state.

---

## The Toast System

We use a custom, Zustand-backed toast system.
- Toasts are triggered via `useBoundStore.getState().addToast("success" | "error", "Message")`.
- Maximum of 5 toasts can be visible at once.
- The `<ToastContainer>` in `App.tsx` renders them.

## Handling API Errors

All API errors must funnel through the centralized `handleError(error)` function in `src/utils/error-handler.ts`.

This function:
1. Parses Axios errors.
2. Extracts backend-provided error messages (`{ Message, Code, Title }` shapes).
3. Handles standard HTTP status codes (e.g., 413 Payload Too Large).
4. Falls back to a generic error message if parsing fails.
5. Automatically triggers an error toast via the store.

## Wiring patterns

There are exactly two standard patterns for wiring errors:

**1. Queries** (Global handler)
We set `handleError` as the global `QueryCache.onError` handler in `main.tsx`. Most individual `useQuery` hooks don't need explicit error handling.

**2. Mutations** (Local handler)
Pass `handleError` directly to the `onError` callback of `useMutation`.
```ts
useMutation({
  mutationFn: ...,
  onError: handleError,
});
```

## Rules

1. **Language**: All user-facing error and success messages must be in **pt-BR**.
2. **Use the centralized handler**: Never parse Axios error objects manually inside a component.

## What NOT to do
- **Don't use `window.alert`**: Always use the Toast system for notifications, and the Modal system for confirmations.
- **Don't `console.error` in production**: The `handleError` utility takes care of logging and user feedback.
