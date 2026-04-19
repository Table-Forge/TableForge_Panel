interface IBaseParams {
  search?: string;
  logType?: string;
  startDate?: Date | string;
  endDate?: Date | string;
}

export type IGetParams = IBaseParams;

export type IGetPaginatedParams = IPaginationResponse & IBaseParams;

export interface IPaginationResponse {
  page?: number;
  size?: number;
  filteredItems?: number;
}
