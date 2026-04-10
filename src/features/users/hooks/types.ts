import type {
  IGetPaginatedParams,
  IPaginationResponse,
} from "@/src/interfaces";
import type { IUser } from "../schemas/user.schema";

type IGetUsers = IGetPaginatedParams & { enabled?: boolean };

type IGetAllUsersResponse = {
  items: IUser[];
  pagination: IPaginationResponse;
};

export type { IGetAllUsersResponse, IGetUsers };
