export interface IGetPaginatedParams {
  page?: number;
  size?: number;
  search?: string;
}

export interface IPaginationResponse {
  page: number;
  itemsPerPage: number;
  filteredItems: number;
}

export interface INormalizedPaginatedResponse<TItem> {
  items: TItem[];
  page: number;
  size: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  nextPage: number | null;
  previousPage: number | null;
}

export type { IMoreOptions } from "@/src/interfaces/get-more-options.interface";
