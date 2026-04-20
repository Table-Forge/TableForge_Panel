import type { IPaginationResponse } from "@/src/interfaces";

export interface IPaginateProps {
  paginationData?: IPaginationResponse;
  onPageChange: (page: number) => void;
  className?: string;
}

export interface IPages {
  id: string | number;
  value: string | number;
  disabled: boolean;
}
