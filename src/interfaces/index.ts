interface IBaseParams {
  search?: string;
  logType?: string;
  startDate?: Date | string;
  endDate?: Date | string;
  type?: number | string;
}

export type IGetParams = IBaseParams;

export type IGetPaginatedParams = IPaginationResponse & IBaseParams;

export interface IPaginationResponse {
  page?: number;
  size?: number;
  filteredItems?: number;
}

export interface IPaginatedResponse<T> {
  items: T[];
  pagination: IPaginationResponse;
}

