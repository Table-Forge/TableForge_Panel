# Styling

This document explains our styling approach using Tailwind CSS v4.

---

## Reference implementations
- [index.css](../../src/index.css) — Tailwind entry point and `@theme` definitions.
- [tailwind.config.js](../../tailwind.config.js) — Tailwind configuration.

---

## Tailwind v4

We use Tailwind CSS v4 exclusively for styling. We do not use styled-components, CSS modules, or inline style objects (unless for highly dynamic properties like position bounds).

## The theme

We use a strictly **dark theme**.
- Background: `#0A0A1B`
- Primary: `#1A1A2E`
- Secondary: `#7E87E2`
- Tertiary: `#FB4501`

Tokens are defined in `src/index.css` using the `@theme` directive, making them available as standard Tailwind utility classes (e.g., `bg-primary`, `text-secondary`).

## Rules

1. **Utility-first**: Build components using inline Tailwind classes.
2. **Helper functions**: For highly complex components with many conditional states, extract class logic into a helper function (e.g., `getInputClasses(error, disabled)`).
3. **Use tokens**: Never use raw hex codes (e.g., `text-[#FF0000]`) in components. Always define the color in the theme and use the named token.
4. **Responsive design**: Use Tailwind's default breakpoints (`sm:`, `md:`, `lg:`) for responsive layouts.

## What NOT to do
- **Don't install CSS-in-JS libraries**: Do not use `styled-components` or `@emotion/styled`.
- **Don't write custom CSS**: Avoid adding custom CSS classes to `index.css` unless it's impossible to achieve with Tailwind utilities (e.g., specific scrollbar pseudo-selectors or third-party library overrides).
