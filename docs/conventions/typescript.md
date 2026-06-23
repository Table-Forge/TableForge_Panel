# TypeScript

This document outlines our TypeScript configuration and naming conventions.

---

## Reference implementations
- [types/global.types.ts](../../src/types/global.types.ts) — Global type definitions.
- [tsconfig.app.json](../../tsconfig.app.json) — TypeScript compiler options for the app.

---

## Where things live

- **Domain types**: Live in `src/features/<domain>/schemas/` and are inferred from Zod.
- **Global types**: Live in `src/types/` (e.g., generic pagination responses).
- **Interfaces**: Shared object shapes live in `src/interfaces/`.

## Naming conventions

- **Interfaces**: Prefix with `I` (e.g., `ICampaign`, `IUser`).
- **Type aliases**: Prefix with `T` (e.g., `TEnvironment`, `TModalSize`).
- **Enums**: We generally avoid TypeScript `enum` in favor of union types (`type TStatus = "active" | "inactive"`) or static constant objects.

## Rules

1. **Strict mode**: TypeScript strict mode is enabled.
2. **Infer from schemas**: Never write a domain interface by hand if a Zod schema exists. Always use `z.infer<typeof Schema>`.
3. **Explicit returns**: Exported functions and hooks should generally have explicit return types, though type inference is acceptable for simple components.
4. **Path aliases**: Use `@/src/*` for all absolute imports.

## What NOT to do
- **No `any`**: The `any` type is strictly forbidden. Use `unknown` and narrow the type, or define a proper generic.
- **No unused locals**: The compiler will throw an error for unused variables. If you must ignore a variable in a destructure, prefix it with `_` (e.g., `const { _ignore, keep } = data;`).
