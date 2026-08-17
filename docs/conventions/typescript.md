# TypeScript

This document outlines our TypeScript configuration and naming conventions.

---

## Reference implementations
- [tsconfig.app.json](../../tsconfig.app.json) — Compiler options for the app.
- [features/campaigns/schemas/campaign.schema.ts](../../src/features/campaigns/schemas/campaign.schema.ts) — Domain type inferred from Zod (`ICampaign`).
- [types/global.types.ts](../../src/types/global.types.ts) — Global type definitions.

---

## Where things live

- **Domain types**: Live in `src/features/<domain>/schemas/` and are inferred from Zod (`export type ICampaign = z.infer<typeof CampaignSchema>`).
- **Request/response types**: Live in `src/features/<domain>/hooks/types.ts` (e.g., `IGetCampaigns`, `IGetAllCampaignsResponse` in [features/campaigns/hooks/types.ts](../../src/features/campaigns/hooks/types.ts)).
- **Global types**: Live in `src/types/global.types.ts` (`TPrimitives`, select option shapes).
- **Shared interfaces**: Pagination/query-param shapes live in `src/interfaces/` (`IGetPaginatedParams`, `IPaginationResponse`).
- **Component prop types**: Live next to the component, often in a `*.interfaces.ts` sibling file (e.g., `components/table/table.interfaces.ts`).

## Naming conventions

- **Interfaces and Zod-inferred domain types**: Prefix with `I` (e.g., `ICampaign`, `IPaginationResponse`, `IButton`). This applies even when the domain type is a `type` alias from `z.infer`.
- **Type aliases**: Prefix with `T` (e.g., `TEnvironment`, `TModalSize`, `TPrimitives`).
- **Known deviations in the codebase** (do not extend them): local component props sometimes use unprefixed `XxxProps` (e.g., `SkeletonProps` in `components/skeleton/skeleton.tsx`), store slice types are unprefixed (`AuthSlice`, `BoundStore` in `store/types.ts`), and `TSelectOptions` in `types/global.types.ts` is a `T`-prefixed interface.
- **Enums**: TypeScript `enum` is not just avoided — it is a compile error, because `erasableSyntaxOnly` is enabled. Use union types (`type TEnvironment = "dev" | "prod" | "local"`) or const objects. Backend enums are fetched at runtime — see [status-and-enums.md](./status-and-enums.md).

## Rules

1. **`strict` is NOT enabled**: Neither tsconfig sets `"strict": true`, so flags like `noImplicitAny` are off. The enabled checks are `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`, `verbatimModuleSyntax`, and `erasableSyntaxOnly`. Do not rely on the compiler to catch implicit `any` — type things explicitly.
2. **Type-only imports**: `verbatimModuleSyntax` requires `import type { ... }` (or inline `type` specifiers) for anything used only as a type, e.g., `import type { IGetPaginatedParams } from "@/src/interfaces";`.
3. **Infer from schemas**: Never write a domain interface by hand if a Zod schema exists. Always use `z.infer<typeof Schema>`.
4. **Path aliases**: Use `@/src/*` for all absolute imports (mapped in `tsconfig.app.json` and `vite.config.ts`).
5. **Type checking runs in build, not lint**: `npm run lint` is ESLint only; `tsc -b` runs as part of `npm run build`.

## What NOT to do
- **No explicit `any`**: `@typescript-eslint/no-explicit-any` is an error via `tseslint.configs.recommended`. The only existing exception is a file-level disable in `src/utils/error-handler.ts` — legacy, do not repeat. Use `unknown` and narrow, or a proper generic.
- **No unused locals/params**: The compiler errors on them (`noUnusedLocals`, `noUnusedParameters`). To discard a value in a destructure, rename it with a `_` prefix — real example from `features/campaigns/services/campaigns.services.ts`: `const { enabled: _enabled, ...queryParams } = params;` (ESLint's `unused-imports/no-unused-vars` ignores the `^_` pattern).
- **No TS `enum`**: Fails compilation under `erasableSyntaxOnly`.
