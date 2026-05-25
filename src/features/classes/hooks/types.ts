import type {
  IGetPaginatedParams,
  IPaginationResponse,
} from "@/src/interfaces";
import type { IClass } from "../schemas/class.schema";

type IGetClasses = IGetPaginatedParams & { enabled?: boolean };

type IGetAllClassesResponse = {
  items: IClass[];
  pagination: IPaginationResponse;
};

export type { IGetAllClassesResponse, IGetClasses };
