import {
  dateOptional,
  imageUrlOptional,
  numberOptional,
  stringOptional,
  stringRequired,
} from "@/src/utils/custom-schema-validations";
import { z } from "zod";

export const GameSystemSchema = z.object({
  id: numberOptional,
  name: stringRequired,
  description: stringOptional,
  imageId: numberOptional,
  imageUrl: imageUrlOptional,
  imageContent: imageUrlOptional,
  createdAt: dateOptional,
  updatedAt: dateOptional,
});

export type IGameSystem = z.infer<typeof GameSystemSchema>;
