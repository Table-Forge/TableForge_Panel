# Status & enums

This document defines how we handle backend enums and render status badges.

---

## Reference implementations
- [components/ui/user-status.tsx](../../src/components/ui/user-status.tsx) — A status badge component.
- [constants/select-options.tsx](../../src/constants/select-options.tsx) — Static option lists.

---

## Backend Enums

Whenever possible, lists of options (like roles, statuses, categories) should be fetched from the backend rather than hardcoded in the frontend.

1. **Enum Hooks**: Create a query hook that fetches the enum.
2. **Mapping**: Use the `mapToSelectOptions` utility to transform the backend response (`{ id, name, value }`) into the `TSelectOptions` shape (`{ label, value }`) expected by our `<Select>` components.

## Status Badges

When rendering a status pill or badge:
- The **label** should ideally come from the backend enum (translated to pt-BR on the server).
- The **color** is strictly a frontend concern.
- Create a specific component (e.g., `UserStatus`) that maps the status value to a Tailwind color class (e.g., `bg-success/20 text-success`).

## Local Option Lists

If an enum does not exist on the backend yet, define a static list in `src/constants/select-options.tsx`.

```ts
export const USER_ROLES: TSelectOptions[] = [
  { label: "Administrador", value: "admin" },
  { label: "Jogador", value: "player" },
];
```

## Rules

1. **Frontend colors**: Never expect the backend to send hex codes or color names. Map statuses to colors on the frontend.
2. **Type safety**: Use string literal unions (`"active" | "inactive"`) in TS interfaces rather than arbitrary strings for statuses.

## What NOT to do
- **Don't hardcode labels if an enum exists**: If the backend provides an enum endpoint, use it as the source of truth for labels.
