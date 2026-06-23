# Pages

This document describes the structure and anatomy of route-level Page components.

---

## Reference implementations
- [pages/campaigns/index.tsx](../../src/pages/campaigns/index.tsx) — A standard listing page.
- [pages/campaigns/details.tsx](../../src/pages/campaigns/details.tsx) — A standard details page.

---

## Anatomy of a listing page

A standard list page in the Panel follows this flow:
1. **State setup**: Initialize filter and pagination state using `useComponentStore`.
2. **Data fetching**: Call the feature's `useAll...` query hook.
3. **Header**: Render the `PageHandler` or `Header` component with the title and "Create" action button.
4. **Filters**: Render a filter bar (search input, status selects).
5. **Table**: Render the data using the shared `<Table>` component, handling loading skeletons and empty states.
6. **Pagination**: Render the `<Paginate>` component at the bottom.
7. **Modals**: Render the Create/Edit and Delete modals conditionally. (Often, modals are pushed to the global `useBoundStore`, so they don't need to be rendered inline).

## Colocation

If a page requires complex sub-components that are NOT reusable elsewhere in the app, place them in a `components/` subdirectory inside the page folder.

```
src/pages/campaigns/
├── index.tsx
├── details.tsx
└── components/
    └── campaign-card.tsx
```

## Rules

1. **Lazy loading**: Import pages using `React.lazy` in the router definition.
2. **Export style**: Pages are the only place where `export default` is acceptable (due to `React.lazy` requirements), though named exports are often used if lazy loading is configured differently. Follow the existing pattern in `App.tsx`.
3. **Keep them thin**: Pages should primarily compose reusable UI components and hook up data. Complex business logic belongs in hooks or services.

## What NOT to do
- **Don't put data fetching in components**: Pages should just call hooks like `useAllCampaigns()`.
- **Don't build inline tables**: Use the shared `<Table>` and `<Table.Column>` components.
