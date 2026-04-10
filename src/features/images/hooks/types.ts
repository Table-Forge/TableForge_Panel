import type {
  IGetPaginatedParams,
  IPaginationResponse,
} from "@/src/interfaces";
import type { IImage } from "@/src/features/images/schemas/image.schema";

type IGetImages = IGetPaginatedParams & { enabled?: boolean };

type IGetAllImagesResponse = {
  items: IImage[];
  pagination: IPaginationResponse;
};

export type { IGetAllImagesResponse, IGetImages };
