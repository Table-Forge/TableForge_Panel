import type { INormalizedPaginatedResponse } from "@/src/interfaces";

interface INormalizePaginatedResponseParams<TItem> {
  payload: unknown;
  requestedPage: number;
  requestedSize: number;
  parseItems: (raw: unknown) => TItem[];
}

function getNumber(value: unknown, fallback: number) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const numeric = Number(value);
    if (Number.isFinite(numeric)) return numeric;
  }
  return fallback;
}

function getBoolean(value: unknown, fallback: boolean) {
  if (typeof value === "boolean") return value;
  return fallback;
}

export function normalizePaginatedResponse<TItem>({
  payload,
  requestedPage,
  requestedSize,
  parseItems,
}: INormalizePaginatedResponseParams<TItem>): INormalizedPaginatedResponse<TItem> {
  const candidate = (payload ?? {}) as Record<string, unknown>;

  const rawItems =
    candidate.items ??
    candidate.content ??
    candidate.results ??
    candidate.data ??
    candidate.rows ??
    [];

  const items = parseItems(rawItems);

  const totalItems = getNumber(candidate.totalItems ?? candidate.totalElements ?? candidate.count, items.length);
  const size = getNumber(candidate.size ?? candidate.pageSize, requestedSize);
  const page = getNumber(candidate.page ?? candidate.currentPage ?? candidate.number, requestedPage);

  const inferredTotalPages =
    totalItems > 0 && size > 0 ? Math.ceil(totalItems / size) : page + (items.length > 0 ? 1 : 0);
  const totalPages = getNumber(candidate.totalPages ?? candidate.pages ?? candidate.lastPage, inferredTotalPages);

  const hasNextPage = getBoolean(
    candidate.hasNextPage ?? candidate.hasNext ?? candidate.next !== undefined,
    page < totalPages,
  );
  const hasPreviousPage = getBoolean(
    candidate.hasPreviousPage ?? candidate.hasPrevious ?? candidate.previous !== undefined,
    page > 1,
  );

  return {
    items,
    page,
    size,
    totalItems,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    nextPage: hasNextPage ? page + 1 : null,
    previousPage: hasPreviousPage ? page - 1 : null,
  };
}
