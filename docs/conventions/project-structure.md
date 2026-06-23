# Project structure

This document outlines the high-level architecture and folder structure of the TableForge Panel project. It serves as the entry point for understanding where code should live.

---

## Reference implementations
- [App.tsx](../../src/App.tsx) — Application root and providers.
- [main.tsx](../../src/main.tsx) — Entry point and QueryClient setup.

---

## Where things live

The `src/` directory is organized by technical concern and feature domains.

- `assets/` — Static assets (images, fonts).
- `components/` — Reusable UI components. Each component gets its own directory.
- `config/` — Environment and global configuration (`env.ts`).
- `constants/` — Application-wide constants (pagination defaults, select options, keyed lists).
- `context/` — React Context providers (e.g., AuthProvider).
- `features/` — Domain feature modules. This is where data fetching lives.
- `hooks/` — Shared, cross-cutting hooks (e.g., `useDebouncedCallback`, `useCountdown`).
- `interfaces/` — Shared TS interfaces. Domain types live in `features/`.
- `pages/` — Route components representing full pages.
- `store/` — Zustand global state management.
- `types/` — Global type definitions.
- `utils/` — Helper functions, formatters, and reusable Zod validators.

## Naming

- **Files and directories**: Always use `kebab-case` (e.g., `use-bound-store.ts`, `modal-edit/`).
- **Components**: PascalCase for function names (`export function Button()`).

## Rules

1. **Path aliases**: Always use the `@/src/...` alias for absolute imports.
2. **Domain types**: Types must be inferred from Zod schemas (`z.infer`). Do not manually declare duplicate interfaces in `interfaces/`.
3. **Data fetching**: All API interaction MUST live inside `src/features/`. Never fetch directly from a page or component.
4. **Environment**: Never access `import.meta.env` directly in application code. Use the `ENV` object from `src/config/env.ts`.

## What NOT to do
- **No default exports**: Do not use `export default` for components or hooks (pages are a minor exception, but named exports are preferred).
- **No class components**: Use functional components exclusively.
- **No unused imports**: The flat ESLint config enforces `"unused-imports/no-unused-imports": "error"`.
