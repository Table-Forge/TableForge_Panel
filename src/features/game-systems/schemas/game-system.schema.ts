import {
  dateOptional,
  numberOptional,
  stringOptional,
  stringRequired,
} from "@/src/utils/custom-schema-validations";
import { z } from "zod";

export const GameSystemSchema = z.object({
  id: numberOptional,
  name: stringRequired,
  description: stringOptional,
  imageId: z.coerce.number().min(0),
  createdAt: dateOptional,
  updatedAt: dateOptional,
});

export type IGameSystem = z.infer<typeof GameSystemSchema>;
