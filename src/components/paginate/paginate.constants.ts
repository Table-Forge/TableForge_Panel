import type { IPaginationResponse } from "@/src/interfaces";

const INITIAL_PAGINATE: Partial<IPaginationResponse> = {
  page: 1,
  itemsPerPage: 20,
};

export { INITIAL_PAGINATE };
