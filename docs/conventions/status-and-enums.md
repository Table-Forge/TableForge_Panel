# Status & enums

This document defines how we handle backend enums and render status badges.

---

## Reference implementations
- [features/users/hooks/enums/use-user-type-enum.ts](../../src/features/users/hooks/enums/use-user-type-enum.ts) — Standard enum hook.
- [utils/map-to-select-options.ts](../../src/utils/map-to-select-options.ts) — Option mapping utility.
- [components/user-status/user-status.tsx](../../src/components/user-status/user-status.tsx) — Status badge component.

---

## Backend enum hooks

Lists of options (types, statuses, genders, roles) come from the backend whenever an enum endpoint exists.

1. **Service method**: Each domain service exposes `get<X>Enum()` hitting `GET /<domain>/enums/<enum-name>` (e.g., `UserService.getTypeEnum()` → `/users/enums/user-type` in `features/users/services/users.services.ts`).
2. **Enum hook**: One hook per enum at `features/<domain>/hooks/enums/use-<name>-enum.ts`, following the standard shape (from `use-user-type-enum.ts`):

```ts
const typeEnumQuery = useQuery({
  queryKey: USER_KEYS.typeEnum(),
  queryFn: () => UserService.getTypeEnum(),
  select: (data) =>
    mapToSelectOptions({ data, labelKey: "name", valueKey: "value" }),
  enabled,
  staleTime: Infinity,
  gcTime: ENUM_GC_TIME,
  refetchOnWindowFocus: false,
});
```

- Query keys come from the domain key factory (`USER_KEYS.enums()` → `USER_KEYS.typeEnum()` in `features/users/hooks/query-key.ts`).
- `staleTime: Infinity` + `gcTime` of 24h: N consumers on screen share a single request.
- Existing enum hooks also funnel errors to `handleError` in a `useEffect` on `query.error` — legacy: the global `QueryCache.onError` already handles it, so do not add this to new hooks (see [errors-and-feedback.md](./errors-and-feedback.md)).
- The hook returns `{ typeEnum, isLoadingTypeEnum, typeEnumQuery }` (list defaults to `[]`).

Legacy variant: `use-user-status-enum.ts` returns the raw response without `mapToSelectOptions` (it only works because the backend shape matches `TSelectOptions`). New hooks must use the `select` + `mapToSelectOptions` pattern.

## Option mapping

`mapToSelectOptions` (`utils/map-to-select-options.ts`) transforms backend items into `TSelectOptions` (`components/select/select.interfaces.ts`):

- Params: `data`, `labelKey`, `valueKey` (defaults to `"id"`; enum hooks pass `"value"`), `filterAllowed` (default `true`), `stringifyValue`.
- Output: `{ id, value, label, name, allowSelect }`. The display text field of `TSelectOptions` is `name` (`label` is optional and may be JSX).
- `filterAllowed: true` drops options with `allowSelect === false` — keep the default in form selects; pass `filterAllowed: false` when resolving labels for listing/display so old records still resolve (hooks exposing the param: `use-user-gender-enum.ts`, `use-log-type-enum.ts`).

Selects fed by entity lists (not enums) build `TSelectOptions` in a `use-<domain>-select` hook, e.g. `features/users/hooks/use-users-select.ts` mapping users to `{ id, value, name }` with debounced server-side search.

## Displaying status in the UI

When rendering a status pill or badge:
- The **label** comes from the backend enum when available (already in pt-BR); local labels are fallback only.
- The **color** is strictly a frontend concern.
- Pattern (see `components/user-status/user-status.tsx` + `pages/users/index.tsx`): a per-domain component holding a local map `status value → { label, Tailwind classes }`, receiving the enum options to prefer the backend `name`:

```tsx
const { statusEnum } = useUserStatusEnum();
<UserStatus value={user.status} options={statusEnum} />
```

`UserStatus` normalizes the incoming value (case/accents via `normalizeString`) and resolves aliases (`"ativo"` → `active`) before matching, so it tolerates both enum names and legacy pt-BR values.

Plain-text variant without badge: campaigns render the label inline — `campaignStatusEnum.find((o) => o.value === campaign.status)?.name || campaign.status` (`pages/campaigns/index.tsx`).

## Local option lists

If an enum does not exist on the backend:
- Static select options go in `src/constants/select-options.tsx` (real examples: `EMPTY_OPTION`, `PAGE_SIZE`).
- Keyed label+color maps go in `src/constants/keyed-lists.ts` (real example: `LOG_ERROR_KEYS`, `value → { name, color }`, consumed by `LogIcon` in `components/logs-icons/logs-icons.tsx` using `cleanStringForKey` to normalize the incoming value).

## Rules

1. **Frontend colors**: Never expect the backend to send hex codes or color names. Map statuses to colors (Tailwind classes or local constants) on the frontend.
2. **Strings, matched resiliently**: Status values travel as enum name strings (`"Active"`, `"Draft"`); schemas type them with `stringRequired`/`stringOptional`. Normalize before matching against local maps.
3. **Cache enums aggressively**: Enum queries always use `staleTime: Infinity` and `refetchOnWindowFocus: false`.

## What NOT to do
- **Don't hardcode labels if an enum exists**: If the backend provides an enum endpoint, use it as the source of truth for labels; local labels are only a fallback for when the enum has not loaded.
- **Don't map enum responses ad hoc in components**: Consume the domain enum hook; the mapping belongs in the hook's `select` via `mapToSelectOptions`.
- **Don't create one-off `TSelectOptions` shapes**: `name` is the display field — don't build options with only `label`.
