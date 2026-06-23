# Data fetching

This document covers how we interact with the backend API, manage server state, and structure the data layer.

---

## Reference implementations
- [features/api.ts](../../src/features/api.ts) — Axios instance and interceptors.
- [features/campaigns/services/campaigns.services.ts](../../src/features/campaigns/services/campaigns.services.ts) — Example service.
- [features/campaigns/hooks/use-all-campaigns.ts](../../src/features/campaigns/hooks/use-all-campaigns.ts) — Example query hook.

---

## The 3-Layer Architecture

All data fetching lives in `src/features/` and follows a strict 3-layer pattern:

1. **Axios Client (`api.ts`)**: Base configuration and token injection via interceptors.
2. **Services (`services/*.ts`)**: Object literals defining the `ENDPOINT` and methods that wrap Axios calls.
3. **Hooks (`hooks/*.ts`)**: TanStack React Query hooks wrapping the services.

## Query keys

Query keys must be centralized using a factory object pattern, usually defined alongside the hooks.

```ts
export const CAMPAIGN_KEYS = {
  all: ["campaigns"] as const,
  lists: () => [...CAMPAIGN_KEYS.all, "list"] as const,
  list: (filters: string) => [...CAMPAIGN_KEYS.lists(), { filters }] as const,
  details: () => [...CAMPAIGN_KEYS.all, "detail"] as const,
  detail: (id: string) => [...CAMPAIGN_KEYS.details(), id] as const,
};
```

## Hooks

### List hooks
List hooks integrate with `useComponentStore` to persist filter and pagination state across navigations.

### Mutation hooks
Mutations must handle success and error states predictably:
- **`onSuccess`**: Invalidate relevant query keys, show a success toast, and optionally close the active modal.
- **`onError`**: Delegate to the centralized `handleError(error)` utility.

```ts
export function useCreateCampaign() {
  const queryClient = useQueryClient();
  const { addToast } = useBoundStore();
  const { closeModal } = useBoundStore();

  return useMutation({
    mutationFn: (data: ICampaignCreate) => CampaignService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CAMPAIGN_KEYS.lists() });
      addToast("success", "Campanha criada com sucesso!");
      closeModal();
    },
    onError: handleError,
  });
}
```

## Rules

1. **No direct Axios usage in components**: Components must exclusively consume data via React Query hooks.
2. **Validate Auth Responses**: The login response must be validated at runtime using `LoginResponseSchema.parse(data)`.
3. **Pagination defaults**: Use `INITIAL_PAGINATE` from `src/constants/paginate.tsx`.

## What NOT to do
- **No data mappers**: Return the backend response shape as-is. Don't write mappers unless bridging to a highly generic component.
- **Don't swallow errors**: Do not use `try/catch` blocks inside components to handle API errors; let React Query's `onError` or global cache handler manage it.
