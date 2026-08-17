# Styling

This document explains our styling approach using Tailwind CSS v4.

---

## Reference implementations
- [index.css](../../src/index.css) — Tailwind entry point, `@theme` tokens, and the sanctioned custom CSS blocks.
- [input/input.styles.ts](../../src/components/input/input.styles.ts) — Conditional class helper (`getInputClasses`).
- [button/button.tsx](../../src/components/button/button.tsx) — Variant class maps and class-array composition.

---

## Tailwind v4

Tailwind CSS v4 runs through `@tailwindcss/vite` (registered in `vite.config.ts`); the entry point is `src/index.css` (`@import "tailwindcss"`). We do not use styled-components, CSS modules, or class-merge libraries (`clsx`, `tailwind-merge`).

The root `tailwind.config.js` is a legacy v3-style file: `index.css` has no `@config` directive, so the v4 build never loads it. The `@theme` block in `src/index.css` is the single source of truth for tokens.

## The theme

Strictly **dark theme** — there is no light mode. Tokens defined in `@theme` (`src/index.css`):

- `background`: `#000000`
- `primary`: `#3a3a3a` (surfaces)
- `secondary` / `tertiary` / `danger`: `#ff2400`
- `white`: `#faf3e0` — remapped: `text-white` renders cream, not pure white; `black` stays `#000000`
- `grays-50` … `grays-600`: gray scale from `#f1f1f1` down to `#1e1e1e`
- `--font-hud`: Inter stack, applied to `body` and available as `font-hud`

Tokens are exposed as standard utilities (`bg-primary`, `text-secondary`, `border-danger`, `text-grays-100`).

## Custom CSS

Custom CSS lives only in `src/index.css` under `@layer base`, and only for what utilities can't reach: third-party overrides (react-datepicker → `.tf-datepicker-*`, react-masonry-css → `.tf-masonry-*`), scrollbar/autofill pseudo-selectors, and keyframe animations (`.animate-recovery-shake`). Prefix project-specific classes with `tf-`.

## Rules

1. **Utility-first**: build components with inline Tailwind classes.
2. **Helper functions**: for components with many conditional states, extract class logic into a `*.styles.ts` helper — `getInputClasses(error, isLoading, disabled)` in `src/components/input/input.styles.ts`. For fixed variants, use `Record` class maps inside the component (`variants` in `button.tsx`). Compose with template literals or `[...].join(" ")`.
3. **Use tokens**: never use arbitrary hex values (e.g., `text-[#FF0000]`) in components — the codebase has zero. Add the color to `@theme` and use the named token.
4. **Responsive design**: use Tailwind's default breakpoints (`sm:`, `md:`, `xl:`) — e.g., `md:grid-cols-2` in `src/pages/dashboard/index.tsx`.
5. **Inline `style` objects**: only for values Tailwind can't express statically — dynamic color on the `hollow` variant in `button.tsx`, stacked z-index and modal width in `modals/global-modal.tsx`.

## What NOT to do
- **Don't install CSS-in-JS libraries**: do not use `styled-components` or `@emotion/styled`.
- **Don't edit `tailwind.config.js` expecting any effect**: it is not loaded by the v4 build — change the `@theme` block in `src/index.css` instead.
- **Don't add custom CSS classes** to `index.css` outside the cases listed above.
- **Don't hardcode colors** in class names or `style` objects — use theme tokens.
