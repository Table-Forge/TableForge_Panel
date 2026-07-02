import {
  dateOptional,
  numberOptional,
  numberRequired,
  stringOptional,
  stringRequired,
} from "@/src/utils/custom-schema-validations";
import { z } from "zod";

export const ImageSchema = z.object({
  id: numberOptional,
  userId: numberOptional,
  campaignId: numberOptional,
  uuid: stringOptional,
  type: numberRequired,
  name: stringRequired,
  content: stringRequired,
  createdAt: dateOptional,
  updatedAt: dateOptional,
  url: stringOptional,
  status: stringOptional,
  version: numberOptional,
});

export type IImage = z.infer<typeof ImageSchema>;
