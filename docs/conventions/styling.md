# Styling

This document explains our styling approach using Tailwind CSS v4.

---

## Reference implementations
- [index.css](../../src/index.css) — Tailwind entry point, `@theme` tokens, the dark/light theme variables, the `chamfer-*` utilities and the sanctioned custom CSS blocks.
- [card/card.tsx](../../src/components/card/card.tsx) — the stone slab: chamfered surface with corner brackets.
- [button/button.tsx](../../src/components/button/button.tsx) — Variant class maps and class-array composition.
- [input/input.styles.ts](../../src/components/input/input.styles.ts) — Conditional class helper (`getInputClasses`).

---

## Tailwind v4

Tailwind CSS v4 runs through `@tailwindcss/vite` (registered in `vite.config.ts`); the entry point is `src/index.css` (`@import "tailwindcss"`). We do not use styled-components, CSS modules, or class-merge libraries (`clsx`, `tailwind-merge`).

The root `tailwind.config.js` is a legacy v3-style file: `index.css` has no `@config` directive, so the v4 build never loads it. The `@theme` block in `src/index.css` is the single source of truth for tokens.

## The theme

The panel ships **two themes**: dark (stone and fire) and light (parchment and ink). `theme-slice.ts` sets `data-theme="dark" | "light"` on `<html>` (toggled by `ThemeToggle`, persisted in `localStorage`), and every token resolves through a `--tf-*` variable defined per theme in `src/index.css`. The same class works in both themes.

Tokens defined in `@theme`:

- `background` — page background (black / parchment).
- `card` — slabs (cards, panels, sidebar, header, table containers).
- `surface` — floating layers (modals, popovers, menus, tooltips, toasts).
- `accent` — the brand red; `secondary`, `tertiary` and `danger` are aliases of it.
- `ember` — lighter red for kickers, seals and counts; `gold` — warm highlight.
- `on-accent` — text/icons on a **solid** accent background (buttons, active page, checked checkbox). Never use `text-white` there: `white` is ink in the light theme.
- `white` — the **foreground** token (cream in dark, ink in light); `black` is its inverse. Both flip with the theme.
- `grays-50` … `grays-600` — neutral scale (warm grays in the light theme).
- `primary` — legacy gray surface; do not use it for new surfaces.
- `--font-hud` (`font-hud`) — Inter Variable, the body font applied to `body`; `--font-display` (`font-display`) — Cinzel Variable, for titles. Both are self-hosted through `@fontsource-variable/*` imports at the top of `index.css`.
- `--shadow-forged` (`shadow-forged`) — inset highlight/shade of forged metal, used on solid accent buttons and chips.

Tokens are exposed as standard utilities (`bg-card`, `text-ember`, `border-accent/40`, `text-grays-100`). Opacity goes through the slash modifier (`bg-white/5`, `border-white/10`).

## The forge visual language

The panel follows the visual language of the landing page and the institutional site: stone slabs with cut corners, chiseled Cinzel titles, keystone marks and fire accents.

- **Chamfers**: `chamfer-sm` (6px), `chamfer-md` (12px) and `chamfer-lg` (20px) are `@utility` classes in `index.css` that cut the top-left and bottom-right corners with `clip-path` (same polygons as the LP). Borders stay on the straight edges; the cut corners are open by design.
- **Cards**: static slabs use `Card` (`components/card/card.tsx`) — `bg-card` + border + two corner brackets. Variants: `default`, `surface`, `highlighted` (ember border and brackets); `padding` (`none` / `sm` / `md`), `cut`, `brackets`, `interactive` (ember brackets on hover, for clickable cards) and `as` for the semantic element. `CardBox` is a titled `Card`.
- **Scroll containers and floating layers** (sidebar, table container, modals, popovers, menus, tooltips, toasts) use the single-element recipe instead of `Card`: `chamfer-* border border-white/10 bg-card` (or `bg-surface` + `border-white/15` for floating layers). The main content frame (`#main-wrapper`) is the exception: a chamfered border with no fill, so the wall shows behind the page.
- **Titles**: page, section, card and modal titles use `font-display font-bold uppercase` with `tracking-[0.04em]` (large) or `tracking-[0.06em]` (small). Listing page titles (`CrmPageHeader`), `CardBox` titles and modal titles lead with a `KeystoneIcon`; details pages lead with the back button instead. Big metric values use `font-display` too. Labels, tables, forms and body copy stay in the body font.
- **Kickers**: eyebrows above titles use `ForgeKicker` (keystone, ember uppercase text, hairline) or the inline recipe `text-[10px] font-semibold uppercase tracking-[0.3em] text-ember`.
- **Seals**: ID/count pills use `chamfer-sm border border-accent/40 bg-accent/15 text-ember`.
- **Loading**: spinners are `D20Icon` with `animate-spin` (see `Button`), not a rounded border spinner.
- **Wall**: the `body` background is the LP brick wall (`--tf-wall`, a 240×120 running-bond SVG) under a vignette (`--tf-wall-vignette`) and the ember glow (`--tf-bg-gradient`) — faint cream lines on stone, faint ink lines on parchment. Page roots (`AdminLayout`, the login and auth pages, the error boundary) stay transparent so the wall shows; never paint `bg-background` on a page root.
- **Texture**: a 5% noise grain (`body::after`, tinted per theme through `--tf-grain`) lies over the whole panel.
- **Sparks**: `ForgeSparks` (canvas particle system ported from the LP) is reserved for the login page. It reads its colors from the theme variables: additive light sparks on stone, dark embers on parchment. It does nothing when "reduce motion" is on.

### Corner hierarchy

1. **Chamfer**: buttons, icon buttons, nav items, badges, seals, tags, chips, pagination, segmented controls, thumbnails (`chamfer-sm`); cards, panels, bars, modals, popovers, menus, table containers (`chamfer-md`, small menus and tooltips `chamfer-sm`); the main content frame, the sidebar and large hero panels (`chamfer-lg`).
2. **`rounded-lg`**: form controls only (inputs, select triggers, text areas) — they stay recognizable as fields. Checkboxes use `rounded-sm`.
3. **Circles** (`rounded-full`): avatars, status dots, counters, progress tracks, toggle knobs and round controls over media.
4. `rounded-md`, `rounded-xl` and larger radii are not used on surfaces.

### What clip-path implies

`clip-path` clips everything outside the shape: box shadows, outer focus rings and children positioned outside the box. Chamfered elements therefore have no `shadow-*` or `backdrop-blur-*` (depth comes from the border, the fill contrast and the grain), and an element whose child must overflow (a counter at `-top-1 -right-1`, a popover arrow) keeps that child outside the clipped element — see the unread counter in `notifications-bell.tsx` and the menu arrow in `more-info.tsx`. Popovers render through portals, so a chamfered container never clips them.

## Custom CSS

Custom CSS lives only in `src/index.css`, and only for what utilities can't reach: the per-theme `--tf-*` variables, the `chamfer-*` `@utility` classes, the wall background and the grain overlay (`body`, `body::after`), third-party overrides (react-datepicker → `.tf-datepicker-*`, react-masonry-css → `.tf-masonry-*`, contract HTML → `.tf-contract-content`), scrollbar/autofill pseudo-selectors, and keyframe animations (`.animate-recovery-shake`). Prefix project-specific classes with `tf-`.

## Rules

1. **Utility-first**: build components with inline Tailwind classes.
2. **Helper functions**: for components with many conditional states, extract class logic into a `*.styles.ts` helper — `getInputClasses(error, isLoading, disabled)` in `src/components/input/input.styles.ts`. For fixed variants, use `Record` class maps inside the component (`variants` in `button.tsx`). Compose with template literals or `[...].join(" ")`.
3. **Use tokens**: never use arbitrary hex/rgba values (e.g., `text-[#FF0000]`) in components. Add the color to `@theme` (with a value for each theme) and use the named token. Accepted exception: the keystone facet fill in `components/icons/icons.tsx`.
4. **Responsive design**: use Tailwind's default breakpoints (`sm:`, `md:`, `xl:`) — e.g., `md:grid-cols-2` in `src/pages/dashboard/index.tsx`.
5. **Inline `style` objects**: only for values Tailwind can't express statically — dynamic color on the `hollow` variant in `button.tsx`, colors that come from the backend in `tag.tsx`, stacked z-index and modal width in `modals/global-modal.tsx`.
6. **Button styling**: buttons are chamfered (`chamfer-sm`, `chamfer-md` for `xl`) with compact heights (`h-7` to `h-12`) and natural-case typography (`font-medium` / `font-semibold text-sm`). Solid variants carry `shadow-forged` and `text-on-accent`.
7. **Surfaces are forge primitives**: a new card or panel is a `Card`; a new scroll container or floating layer uses the chamfer recipe above — never a `rounded-xl border bg-primary/40` recipe.

## What NOT to do
- **Don't install CSS-in-JS libraries**: do not use `styled-components` or `@emotion/styled`.
- **Don't edit `tailwind.config.js` expecting any effect**: it is not loaded by the v4 build — change the `@theme` block in `src/index.css` instead.
- **Don't add custom CSS classes** to `index.css` outside the cases listed above.
- **Don't hardcode colors** in class names or `style` objects — use theme tokens.
- **Don't branch on the theme in components** for colors: a value that differs per theme is a `--tf-*` variable with a value in each `[data-theme]` block. The only theme-aware code is `useLogo()` (logo files) and `ForgeSparks` (canvas palette read from the variables).
- **Don't use `text-white` on a solid accent background** — use `text-on-accent`.
- **Don't add shadows, blur or lifts to chamfered surfaces** — they are clipped away.
