# Components

This document defines how we build, structure, and consume UI components in the Panel.

---

## Reference implementations
- [button/button.tsx](../../src/components/button/button.tsx) — A standard shared component.
- [input/](../../src/components/input/) — Complex input variants.

---

## Where things live

- **Shared components**: Live in `src/components/`. These are highly reusable across multiple domains (e.g., buttons, modals, toasts).
- **Page-specific components**: Live in `src/pages/<page>/components/`. These are tightly coupled to a specific view.

## Naming
- Component directory: `kebab-case`.
- Component file: `kebab-case.tsx` matching the directory name.
- Function name: `PascalCase`.

## Rules

1. **One component per directory**: Even simple components should live in their own directory to group related files (e.g., styles, types) if needed.
2. **Controlled forms**: Form-bound components (like inputs) should use React Hook Form's `useController` under the hood. Avoid `forwardRef` unless strictly necessary.
3. **Styling**: Use Tailwind CSS utility classes inline. For complex, conditional classes, extract a helper function (e.g., `getInputClasses()`).
4. **Props interfaces**: Prefix props interfaces with `I` (e.g., `IButtonProps`).
5. **UI Language**: All user-facing text (labels, placeholders, accessibility strings) must be in **pt-BR**.

## What NOT to do
- **Don't use styled-components or CSS modules**: Tailwind v4 is the exclusive styling solution.
- **Don't duplicate component logic**: Check the existing library (~36 components) before building a new primitive.
- **Don't use `export default`**: Always use named exports for components.
