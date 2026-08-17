# Pages

This document describes the structure and anatomy of route-level Page components.

---

## Reference implementations
- [pages/campaigns/index.tsx](../../src/pages/campaigns/index.tsx) — A standard listing page.
- [pages/campaigns/details.tsx](../../src/pages/campaigns/details.tsx) — A standard details page.
- [pages/campaigns/components/search-filters/search-filters.tsx](../../src/pages/campaigns/components/search-filters/search-filters.tsx) — Page-scoped filter bar.

---

## Anatomy of a listing page

A standard list page in the Panel follows this flow (see `pages/campaigns/index.tsx`):

1. **Hooks setup**: `openModal` from `useBoundStore`, the feature's mutation hook (e.g. `useCampaignsMutation()` → `deleteMutation`), and enum hooks for label resolution.
2. **Data fetching**: call the feature's `useAll...` hook — it returns `{ data, isLoading, isError, filters, setFilters, resetFilters, onSearchChange }`. Filter/pagination state lives inside the hook (via `useComponentStore`, keyed per feature); the page does not initialize it.
3. **Early returns**: `if (isLoading) return <SkeletonTable />;` and `if (isError) return <InfoNotFound />;` (from `components/skeleton/` and `components/page-handler/`).
4. **Header**: a plain `<header>` with an `<h1>` title, a short description `<p>`, and a `Button` opening the create modal via `openModal("Criar Campanha", <ModalEdit />, "md")`. There is no shared page-header component.
5. **Filters**: render the page's `<XSearchFilters />` from its `components/search-filters/` subfolder.
6. **Table**: define columns as `ITableColumn<T>[]` and render the shared `<Table tableContents={...} bodyData={data?.items ?? []} detailsLink="/campaigns" />`. Row actions ("Editar", "Deletar") go in a trailing `MoreInfo` column built by a local `getMoreInfoOptions(item)` helper.
7. **Pagination**: `<Paginate paginationData={data?.pagination} onPageChange={...} />` updating `filters.page` via `setFilters`.
8. **Modals**: never rendered inline — pushed to the global modal store with `openModal(title, content, size)`; `GlobalModal` is mounted once in `App.tsx`. Delete flows use the shared `ModalDelete` with the feature's `deleteMutation`.

## Anatomy of a details page

See `pages/campaigns/details.tsx`:

1. Read `id` from `useParams` and parse it to a number (with a `Number.isFinite` guard).
2. Fetch with the feature's `useXById(id)` hook; same `SkeletonTable`/`InfoNotFound` early returns.
3. Header with the entity title, an "Editar" button opening `ModalEdit` via `openModal`, and a "Voltar" button using `useNavigate` back to the listing.
4. Content composed of `CardBox`/`GridBox`/`InfoBox`/`CardLabel`/`CardValue` from `components/card-box/card-box.tsx`.

## Colocation

Page-specific sub-components live in a `components/` subdirectory inside the page folder, one folder per component:

```
src/pages/campaigns/
├── index.tsx
├── details.tsx
└── components/
    ├── modal-edit/
    │   └── modal-edit.tsx
    └── search-filters/
        └── search-filters.tsx
```

## Rules

1. **No lazy loading**: pages are statically imported in `App.tsx`; `React.lazy` is not used.
2. **Export style**: use a named export — `export function CampaignsPage() {}`. A few legacy pages use `export default` (`pages/users/index.tsx`, `pages/images/index.tsx`, `pages/verify-email/index.tsx`); do not add new ones.
3. **Keep them thin**: pages compose shared components and call feature hooks. Fetching, filter state, and mutations live in `src/features/<feature>/hooks/`.
4. **UI strings in pt-BR** with correct accents ("Criar Campanha", "Título", "Frequência"); code identifiers in English.

## What NOT to do
- **Don't manage filter/pagination state in the page**: the `useAll...` hook owns it through `useComponentStore`.
- **Don't build inline tables**: use the shared `<Table>` with `ITableColumn<T>[]` column definitions (there is no `<Table.Column>` API).
- **Don't render CRUD modals inline**: open them through `openModal` on the global modal store.
