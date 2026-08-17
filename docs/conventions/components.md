# Components

This document defines how we build, structure, and consume UI components in the Panel.

---

## Reference implementations
- [button/button.tsx](../../src/components/button/button.tsx) — Standard shared component with variant class maps.
- [input/input.default.controlled.tsx](../../src/components/input/input.default.controlled.tsx) — Form-bound component using `useController`.
- [pages/users/components/modal-edit/modal-edit.tsx](../../src/pages/users/components/modal-edit/modal-edit.tsx) — Page-specific component composing the shared library.

---

## Where things live

- **Shared components**: `src/components/` (36 directories, plus the legacy `ui/`). Highly reusable across domains (buttons, inputs, modals, table, toast).
- **Page-specific components**: `src/pages/<page>/components/`. CRUD pages follow a fixed shape: `modal-edit/modal-edit.tsx` and `search-filters/search-filters.tsx` (e.g., `src/pages/users/components/`).
- **Imports** always use the `@/src/...` alias (configured in `vite.config.ts` and `tsconfig.app.json`), even between sibling components.

## Naming

- Component directory: `kebab-case`; the base file matches the directory name (`button/button.tsx`).
- Variants are dot-suffixed files in the same directory: `input.masked.tsx`, `input.textarea.controlled.tsx`. React Hook Form-bound variants end in `.controlled.tsx` (legacy exception: `checkbox/checkbox-controlled.tsx`).
- Sibling files share the base name: `*.interfaces.ts`, `*.styles.ts`, `*.constants.ts`, `*.context.ts` (see `input/input.styles.ts`, `filters/filters.context.ts`). Use `.interfaces.ts` for new files — `.interface.ts` (`modals/`, `paginate/`) and the misspelled `.intefaces.ts` (`button/`, `input/`) are legacy spellings that still exist.
- Function name: `PascalCase`, exported as a named export.

## Rules

1. **One directory per component family**: variants and sibling files stay together (see `input/`, which holds all input variants plus `input.intefaces.ts` and `input.styles.ts`).
2. **Controlled form components**: receive the whole `useForm` return as a `hookForm` prop plus a typed `name` (`IControllerInput<TFieldValues>` in `input/input.intefaces.ts`), call `useController({ name, control: hookForm.control })` internally, and render their own `<ErrorMessage>`. Pages never wire `useController`/`Controller` themselves — see `modal-edit.tsx`.
3. **Base (uncontrolled) inputs** use `forwardRef` + `displayName` (`input/input.default.tsx`, `checkbox/checkbox.tsx`). Don't add `forwardRef` elsewhere unless a ref is actually consumed.
4. **Props interfaces**: `I` prefix, named after the component without a `Props` suffix (`IButton`, `IInput`, `IMultiSelect`), declared in the sibling `*.interfaces.ts` file. Standalone types use a `T` prefix (`TModalSize`, `TConfirmationStatus`).
5. **Styling**: inline Tailwind classes; fixed variants as `Record<...>` class maps (`variants` in `button.tsx`); conditional class builders in `*.styles.ts` helpers (`getInputClasses(error, isLoading, disabled)`). Compose with template literals or `[...].join(" ")` — see [styling.md](./styling.md).
6. **UI language**: all user-facing text in **pt-BR** with correct accents ("Carregando...", "Salvar alterações", "Gênero").
7. **Modals and toasts**: page modal components are plain content rendered by `modals/global-modal.tsx`; opening/closing and toasts go through the zustand store (`useBoundStore` → `closeModal`, `addToast`).

## What NOT to do
- **Don't use styled-components or CSS modules**: Tailwind v4 is the exclusive styling solution.
- **Don't add class-merge libraries**: no `clsx`, `classnames`, or `tailwind-merge` in the project.
- **Don't duplicate component logic**: check the existing library in `src/components/` before building a new primitive.
- **Don't use `export default`**: always use named exports. A few pages still default-export (`src/pages/users/index.tsx`) — legacy, don't replicate.
