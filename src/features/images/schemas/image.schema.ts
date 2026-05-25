import { IMAGE_TYPE_VALUES } from "@/src/constants/select-options";
import {
  dateOptional,
  numberOptional,
  stringOptional,
  stringRequired,
} from "@/src/utils/custom-schema-validations";
import { z } from "zod";

const ImageTypeSchema = z.enum(IMAGE_TYPE_VALUES, {
  message: "Selecione um tipo de imagem válido.",
});

export const ImageSchema = z.object({
  id: numberOptional,
  userId: numberOptional,
  campaignId: numberOptional,
  uuid: stringOptional,
  type: ImageTypeSchema,
  name: stringRequired,
  content: stringRequired,
  createdAt: dateOptional,
  updatedAt: dateOptional,
  url: stringOptional,
  status: stringOptional,
  version: numberOptional,
});

export type IImage = z.infer<typeof ImageSchema>;
export { ImageTypeSchema };
