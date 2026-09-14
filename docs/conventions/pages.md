# Pages

This document describes the structure and anatomy of route-level Page components in the Panel (Listing and Details pages).

---

## Reference implementations
- [pages/users/index.tsx](../../src/pages/users/index.tsx) — Canonical listing page model.
- [pages/users/details.tsx](../../src/pages/users/details.tsx) — Canonical details page model.
- [pages/users/components/search-filters/search-filters.tsx](../../src/pages/users/components/search-filters/search-filters.tsx) — Standard search filter bar component.
- [features/users/hooks/use-all-users.ts](../../src/features/users/hooks/use-all-users.ts) — Standard paginated list hook.
- [features/users/hooks/use-user-by-id.ts](../../src/features/users/hooks/use-user-by-id.ts) — Standard detail hook.

---

## Anatomy of a listing page

A standard listing page in the Panel follows this flow (see `pages/users/index.tsx`):

### 1. Hooks Setup
- Global modal control: `openModal` from `useBoundStore`.
- Feature mutations: e.g. `const { deleteMutation } = useUsersMutation();`.
- Enum hooks: e.g. `const { statusEnum } = useUserStatusEnum();` for label/badge resolution.
- Data fetching hook: `const { data, isLoading, isError, filters, setFilters } = useAllUsers();`.
  - Filter and pagination state lives inside the hook (via `useComponentStore`, keyed per feature under `<FEATURE>_COMPONENT_FILTER_KEY`).
  - The query MUST configure `placeholderData: (previousData) => previousData` so searches and pagination keep the previous data visible and never re-trigger `isLoading` or unmount the table.

### 2. Early Returns
- Loading state: `if (isLoading) return <SkeletonTable />;` (only triggers on initial mount when there is no cached or placeholder data).
- Error state: `if (isError) return <InfoNotFound message="Ocorreu um erro ao carregar os dados." />;`.

### 3. Header (`CrmPageHeader`)
Every standard listing page uses the shared `CrmPageHeader` component (`@/src/components/crm-page-header/crm-page-header`):
```tsx
<CrmPageHeader
  title="Usuários"
  subtitle="Gerencie os usuários do sistema, perfis e permissões."
  count={totalItems}
  actionLabel="Criar Usuário"
  actionIcon={<MdAdd />}
  onActionClick={() => openModal("Criar Usuário", <ModalEdit />, "md")}
  stats={[
    {
      title: "Total Usuários",
      value: totalItems,
      badge: "Geral",
      badgeType: "neutral",
    },
    {
      title: "Ativos",
      value: activeCount,
      badge: "Verificados",
      badgeType: "success",
    },
    {
      title: "Exibindo",
      value: data?.items?.length ?? 0,
      badge: "Página Atual",
      badgeType: "neutral",
    },
  ]}
/>
```

### 4. Search and Filter Bar (`<XSearchFilters />`)
Lives in `components/search-filters/search-filters.tsx`:
- **Input standard**: MUST always use `Input` from `@/src/components/input/input.default`.
- **Search debounce**: MUST debounce search text changes with 500ms (`useDebouncedCallback`) before calling `onSearchChange`, preventing requests on every keystroke.
- **Visual container**:
  ```tsx
  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
    <div className="w-full flex flex-row gap-3 items-center rounded-xl border border-white/10 bg-primary/55 p-3 sm:flex-1">
      <Input
        {...form.register("search")}
        placeholder="Buscar usuário por nome, apelido ou e-mail"
        wrapperClassName="w-full"
      />
      <Filters
        filters={<AdvancedFiltersContent filters={filters} />}
        align="left"
      />
    </div>
  </div>
  ```
- **Advanced filters popover**: `AdvancedFiltersContent` provides additional select filters (status, category, platform, size) and applies them via `setFiltersGlobal(KEY, { ...filters, ...data, page: 1 })`.

### 5. Table (`<Table />`)
Render the shared `<Table>` component:
```tsx
<Table
  tableContents={tableContents}
  bodyData={data?.items ?? []}
  detailsLink="/users"
  emptyMessage="Nenhum usuário encontrado."
/>
```
- Define columns via `tableContents: ITableColumn<T>[]`:
  - `ID`: styled with `<span className="font-bold">{item.id}</span>`.
  - Images / Avatars: `<Thumbnail image={item.avatarUrl} width={40} height={40} rounded="full" alt="..." />`.
  - Badges / Status: `<UserStatus value={item.status} options={statusEnum} />` or `<MatrixTag />`.
  - Formatted Dates: `formatDate(item.createdAt)`.
  - Trailing `MoreInfo` column: row actions ("Editar", "Deletar") built with a local `getMoreInfoOptions(item)` helper.

### 6. Pagination (`<Paginate />`)
Rendered below the table when items exist:
```tsx
{data && data.items.length > 0 && (
  <Paginate
    paginationData={data?.pagination}
    onPageChange={(nextPage) =>
      setFilters({
        ...filters,
        page: nextPage,
      })
    }
  />
)}
```

---

## Anatomy of a details page

A standard details page in the Panel follows this flow (see `pages/users/details.tsx`):

### 1. Route Parameter & Query
- Read `id` from `useParams()` and parse safely:
  ```tsx
  const { id } = useParams();
  const userId = useMemo(() => {
    const parsed = Number(id);
    return Number.isFinite(parsed) ? parsed : undefined;
  }, [id]);
  ```
- Fetch with the feature hook: `const { data, isLoading, isError } = useUserById(userId);`.

### 2. Early Returns
- Loading state: `if (isLoading) return <SkeletonDetails />;`.
- Error or empty state: `if (isError || !data) return <InfoNotFound />;`.

### 3. Header Toolbar
Navigation back button, entity title, ID pill, metadata subtitle, and action buttons:
```tsx
<header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
  <div className="flex items-center gap-3">
    <button
      type="button"
      onClick={() => navigate("/users")}
      className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-primary/60 text-white/80 transition-all hover:border-white/20 hover:bg-white/10 hover:text-white"
      title="Voltar para a lista"
    >
      <ArrowLeft size={18} />
    </button>
    <div>
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-extrabold uppercase tracking-tight text-white">
          {data.nickname || data.username || "Usuário"}
        </h1>
        <span className="rounded-full border border-white/10 bg-white/10 px-3 py-0.5 text-xs font-extrabold tracking-wide text-white/90">
          #{data.id}
        </span>
      </div>
      <p className="text-xs font-semibold text-grays-100">
        @{data.username} • {data.email || "Sem e-mail"}
      </p>
    </div>
  </div>

  <div className="flex items-center gap-3">
    <Button
      buttonStyle="primary"
      size="sm"
      onClick={() => openModal("Editar Usuário", <ModalEdit data={data} />, "md")}
      className="shadow-lg hover:shadow-secondary/20"
    >
      <MdModeEdit />
      Editar Usuário
    </Button>
  </div>
</header>
```

### 4. Bento Box Hero Section
A multi-column visual showcase composed of:
- **Hero Identity Card (1 column)**: Avatar / banner via `Thumbnail`, display name, subtitle identifier, and status badge (`UserStatus` / `MatrixTag`).
- **Key Metric Cards (2 columns)**: Grid of metric boxes with uppercase label (`text-xs font-bold uppercase tracking-wider text-grays-200`), primary value (`text-xl font-extrabold text-white`), and footnote tag (`text-[10px] font-bold text-white/60`).

### 5. Details Grid (`CardBox`)
Structured field sections using the layout primitives from `@/src/components/card-box/card-box`:
- `CardBox`: Section container with title.
- `GridBox`: Responsive grid wrapper (`lg:grid-cols-2`).
- `InfoBox`: Field container.
- `CardLabel`: Field label styling.
- `CardValue`: Field value styling.

Example:
```tsx
<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
  <CardBox title="Informações de Conta">
    <GridBox className="lg:grid-cols-2">
      <InfoBox>
        <CardLabel>ID de Usuário</CardLabel>
        <CardValue>{String(data.id ?? "-")}</CardValue>
      </InfoBox>
      <InfoBox>
        <CardLabel>Nome de Usuário</CardLabel>
        <CardValue>{data.username ?? "-"}</CardValue>
      </InfoBox>
      <InfoBox>
        <CardLabel>E-mail</CardLabel>
        <CardValue className="break-all">{data.email ?? "-"}</CardValue>
      </InfoBox>
    </GridBox>
  </CardBox>
</div>
```

---

## Colocation

Page-specific sub-components live in a `components/` subdirectory inside the page folder, one folder per component:

```
src/pages/users/
├── index.tsx
├── details.tsx
└── components/
    ├── modal-edit/
    │   └── modal-edit.tsx
    └── search-filters/
        └── search-filters.tsx
```

---

## Rules

1. **No lazy loading**: pages are statically imported in `App.tsx`; `React.lazy` is not used.
2. **Export style**: use named export — `export function UsersPage() {}` (or default if legacy).
3. **Keep them thin**: pages compose shared components and call feature hooks. Fetching, filter state, and mutations live in `src/features/<feature>/hooks/`.
4. **UI strings in pt-BR** with correct accents ("Criar Usuário", "Título", "Usuários"); code identifiers in English.
5. **Always use standard `Input`**: Search inputs must always import `{ Input } from "@/src/components/input/input.default"`.
6. **Debounce is mandatory on search**: All search filter inputs must debounce typing (500ms via `useDebouncedCallback`) to avoid triggering searches on every keystroke.
7. **`placeholderData` is mandatory on list queries**: All list queries (`useAll...`) must specify `placeholderData: (previousData) => previousData` to prevent flickering and unintended `<SkeletonTable />` remounts during search and pagination.

---

## What NOT to do
- **Don't manage filter/pagination state in page `useState`**: the `useAll...` hook owns it through `useComponentStore`.
- **Don't search without debounce**: never wire `onChange` directly to fetch or filter updates without `useDebouncedCallback`.
- **Don't omit `placeholderData` on list queries**: omitting it causes `isLoading = true` on every search character and remounts the skeleton table.
- **Don't use raw `<input>`**: always use `Input` from `@/src/components/input/input.default`.
- **Don't build inline tables**: use the shared `<Table>` with `ITableColumn<T>[]` column definitions.
- **Don't render CRUD modals inline**: open them through `openModal` on the global modal store.
