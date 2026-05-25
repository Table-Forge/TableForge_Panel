import { z } from "zod";
import {
  dateOptional,
  numberOptional,
  stringOptional,
  stringRequired,
} from "@/src/utils/custom-schema-validations";

export const ClassSchema = z.object({
  id: numberOptional,
  createdAt: dateOptional,
  updatedAt: dateOptional,
  name: stringRequired,
  description: stringOptional,
});

export type IClass = z.infer<typeof ClassSchema>;
