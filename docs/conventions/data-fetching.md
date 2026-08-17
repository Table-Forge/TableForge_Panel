# Data fetching

This document covers how we interact with the backend API, manage server state, and structure the data layer.

---

## Reference implementations
- [features/api.ts](../../src/features/api.ts) — Axios instance and auth request interceptor.
- [features/campaigns/services/campaigns.services.ts](../../src/features/campaigns/services/campaigns.services.ts) — Example service.
- [features/campaigns/hooks/use-all-campaigns.ts](../../src/features/campaigns/hooks/use-all-campaigns.ts) — Example list hook.

---

## The 3-Layer Architecture

All data fetching lives in `src/features/` and follows a strict 3-layer pattern:

1. **Axios client (`src/features/api.ts`)**: `baseURL` from `ENV.API_URL` (`src/config/env.ts`), 60s timeout, and a request interceptor that injects the `Bearer` token read from `localStorage` (`AUTH_STORAGE_KEY`). There is no response interceptor.
2. **Services (`services/*.services.ts`)**: object literals (e.g. `CampaignService`) with a local `const ENDPOINT = "/campaigns"` and async methods that wrap Axios calls and return `data`.
3. **Hooks (`hooks/*.ts`)**: TanStack Query hooks wrapping the services.

Every feature follows the same folder layout (see `src/features/campaigns/`):

```
src/features/<feature>/
  hooks/
    query-key.ts               // query key factory
    types.ts                   // request/response types
    enums/                     // backend enum hooks (see status-and-enums.md)
    use-all-<feature>.ts       // paginated list
    use-<feature>-by-id.ts     // detail
    use-<feature>-mutations.ts // create/update/delete
    use-<feature>-select.ts    // options for select fields (when needed)
  schemas/<feature>.schema.ts
  services/<feature>.services.ts
```

## Query client defaults

Set once in `src/main.tsx`: `staleTime` 5 min, `gcTime` 24 h, `retry: 0`, `refetchOnWindowFocus` and `refetchOnReconnect` disabled, plus a global `QueryCache.onError` wired to `handleError` (see [errors-and-feedback.md](./errors-and-feedback.md)).

## Query keys

Each feature centralizes its keys in `hooks/query-key.ts` using a factory object. Real example (`src/features/campaigns/hooks/query-key.ts`):

```ts
export const CAMPAIGN_KEYS = {
  all: ["campaigns"] as const,
  lists: () => [...CAMPAIGN_KEYS.all, "list"] as const,
  list: (filters: IGetCampaigns = {}) => [...CAMPAIGN_KEYS.lists(), filters] as const,
  details: () => [...CAMPAIGN_KEYS.all, "detail"] as const,
  detail: (id?: number) => [...CAMPAIGN_KEYS.details(), id] as const,
  enums: () => [...CAMPAIGN_KEYS.all, "enums"] as const,
};
```

## Hooks

### List hooks (`use-all-<feature>.ts`)
Follow `use-all-campaigns.ts`:
- Persist filters/pagination in `useComponentStore` under an exported `<FEATURE>_COMPONENT_FILTER_KEY`.
- Initial filters = `INITIAL_PAGINATE` from `src/constants/paginate.tsx` (`{ page: 1, size: 20 }`) plus `search: ""`.
- `placeholderData: (previousData) => previousData` to keep the previous page visible while fetching.
- `onSearchChange` debounced at 500 ms via `useDebouncedCallback` (`src/hooks/utils/useDebouncedCallback.ts`), resetting `page` to 1.
- Return `{ ...query, filters, setFilters, resetFilters, onSearchChange }`.

### Detail hooks (`use-<feature>-by-id.ts`)
`useQuery` with `queryKey: KEYS.detail(id)` and `enabled: !!id`. Example: `src/features/campaigns/hooks/use-campaign-by-id.ts`.

### Select hooks (`use-<feature>-select.ts`)
Local `useState` search with the same 500 ms debounce, items mapped to `TSelectOptions`, `staleTime` 30 min. Example: `src/features/campaigns/hooks/use-campaigns-select.ts`.

### Mutation hooks (`use-<feature>-mutations.ts`)
One combined hook per feature exposing `createMutation`, `updateMutation`, `deleteMutation`, a `createOrUpdate(data)` helper (routes on `data.id`), and an aggregated `isPending`. Real shape (`src/features/campaigns/hooks/use-campaigns-mutations.ts`):

```ts
export const useCampaignsMutation = () => {
  const queryClient = useQueryClient();
  const addToast = useBoundStore((state) => state.addToast);
  const closeModal = useBoundStore((state) => state.closeModal);

  const createMutation = useMutation({
    mutationFn: (data: ICampaign) => CampaignService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CAMPAIGN_KEYS.lists() });
      addToast("success", "Campanha salva com sucesso!");
      closeModal();
    },
    onError: (error: Error) => handleError(error),
  });

  // updateMutation and deleteMutation follow the same shape,
  // additionally invalidating CAMPAIGN_KEYS.detail(id) / details()
};
```

- **`onSuccess`**: invalidate the affected query keys, show a pt-BR success toast, and `closeModal()`.
- **`onError`**: always delegate to `handleError` (`src/utils/error-handler.ts`).

## Rules

1. **No direct Axios usage outside `src/features/`**: components consume data exclusively through the feature hooks. The only files importing `axios`/`api` are `api.ts` and the `*.services.ts` files.
2. **Validate auth responses**: `AuthService.login` validates the response at runtime with `LoginResponseSchema.parse(data)` (`src/features/auth/services/auth.services.ts`).
3. **Pagination defaults**: use `INITIAL_PAGINATE` from `src/constants/paginate.tsx`.

## What NOT to do
- **No data mappers**: return the backend response shape as-is. The only accepted mapping is bridging to generic UI components (e.g. `mapToSelectOptions` producing `TSelectOptions`).
- **Don't swallow errors**: no `try/catch` around API calls in components; errors flow through the global `QueryCache.onError` or the mutation `onError` (see [errors-and-feedback.md](./errors-and-feedback.md)).
- **Don't create per-operation mutation hooks** (`useCreateCampaign`, `useDeleteUser`, ...): the codebase uses one combined `use<Feature>Mutation` hook per feature.
- **Don't inline endpoint strings in hooks or components**: URLs live only in the feature's service behind the `ENDPOINT` constant.
