# Project structure

This document outlines the high-level architecture and folder structure of the TableForge Panel project. It serves as the entry point for understanding where code should live.

---

## Reference implementations
- [App.tsx](../../src/App.tsx) — Application root: `AuthProvider`, `BrowserRouter`, routes, global overlays (`GlobalModal`, `EnvFlag`, `ToastContainer`).
- [main.tsx](../../src/main.tsx) — Entry point: `QueryClient` setup, `QueryClientProvider`, `ReactQueryDevtools`, `StrictMode`.
- [features/campaigns/hooks/use-all-campaigns.ts](../../src/features/campaigns/hooks/use-all-campaigns.ts) — Example of a fully-formed feature module hook.

---

## Where things live

The `src/` directory is organized by technical concern and feature domains. Top-level files: `App.tsx`, `main.tsx`, `index.css` (Tailwind v4 entry).

- `assets/` — Static images (`hero.png`, `react.svg`, `vite.svg`).
- `components/` — Reusable UI components. Each component gets its own kebab-case directory, with optional sibling files like `*.interfaces.ts`, `*.styles.ts`, `*.constants.ts` (e.g., `components/toast/`, `components/input/`). See [components.md](./components.md).
- `config/` — Environment configuration. Contains only `env.ts`.
- `constants/` — Application-wide constants: `paginate.tsx` (`INITIAL_PAGINATE`), `select-options.tsx`, `keyed-lists.ts`.
- `context/` — React Context providers: `auth.tsx` (`AuthProvider`) and `use-auth.ts`.
- `features/` — Domain feature modules; this is where all data fetching lives. Each domain follows `features/<domain>/{hooks,schemas,services}`, with `hooks/query-key.ts`, `hooks/types.ts`, and `hooks/enums/` for backend enum hooks (e.g., `features/campaigns/`). The shared Axios instance is `features/api.ts`. See [data-fetching.md](./data-fetching.md).
- `hooks/` — Shared, cross-cutting hooks, currently under `hooks/utils/` (e.g., `use-countdown.ts`, `useDebouncedCallback.ts`).
- `interfaces/` — Shared request/pagination interfaces (`IGetPaginatedParams`, `IPaginationResponse` in `index.ts`, plus `error.interface.ts` and `get-more-options.interface.ts`). Domain types live in `features/`.
- `pages/` — Route components, one kebab-case directory per route with an `index.tsx` (e.g., `pages/campaigns/`, `pages/campaigns/details.tsx` for detail routes). Page-scoped components live in a `components/` subfolder inside the page (e.g., `pages/campaigns/components/modal-edit/`). See [pages.md](./pages.md) and [routing.md](./routing.md).
- `store/` — Zustand global state: `use-bound-store.ts` composed from `slices/`, plus `use-component-store.ts` for per-page filter persistence. See [state-management.md](./state-management.md).
- `types/` — Global type definitions (`global.types.ts`).
- `utils/` — Helper functions: `format.ts`, `error-handler.ts`, `map-to-select-options.ts`, and reusable Zod validators in `custom-schema-validations.ts`.

## Naming

- **Files and directories**: `kebab-case` (e.g., `use-bound-store.ts`, `modal-delete/`). Exceptions that exist today: `App.tsx` and three legacy camelCase hooks in `hooks/utils/` (`useDebouncedCallback.ts`, `useDropdownPosition.ts`, `usePortalPosition.ts`). New files must be kebab-case.
- **Components**: PascalCase function names with named exports (`export function CampaignsPage()`, `export const EnvFlag = ...`).
- **Types**: see [typescript.md](./typescript.md).

## Rules

1. **Path aliases**: Always use the `@/src/...` alias for absolute imports. It is defined in both [vite.config.ts](../../vite.config.ts) (`resolve.alias`) and [tsconfig.app.json](../../tsconfig.app.json) (`paths`).
2. **Domain types**: Types must be inferred from Zod schemas (`z.infer`), e.g., `ICampaign` in `features/campaigns/schemas/campaign.schema.ts`. Do not manually declare duplicate interfaces in `interfaces/`.
3. **Data fetching**: All API interaction MUST live inside `src/features/` (service + hook layers over `features/api.ts`). Never fetch directly from a page or component. Known legacy exception: `components/location-autocomplete/location-autocomplete.tsx` calls the Geoapify API with `fetch` directly — do not replicate.
4. **Environment**: Never access `import.meta.env` directly in application code. Use the `ENV` object from `src/config/env.ts`. See [environment.md](./environment.md).

## What NOT to do
- **Don't use default exports**: no `export default` for components or hooks. Legacy exceptions exist (`App.tsx`, `pages/images/index.tsx`, `pages/users/index.tsx`, `pages/verify-email/index.tsx`); prefer named exports for anything new.
- **Don't write class components**: use functional components exclusively.
- **Don't leave unused imports**: [eslint.config.js](../../eslint.config.js) enforces `"unused-imports/no-unused-imports": "error"`.
