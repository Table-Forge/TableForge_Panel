import { z } from "zod";
import {
  numberOptional,
  stringOptional,
  stringRequired,
} from "@/src/utils/custom-schema-validations";

export const ClassSchema = z.object({
  id: numberOptional,
  name: stringRequired,
  description: stringOptional,
});

export type IClass = z.infer<typeof ClassSchema>;
