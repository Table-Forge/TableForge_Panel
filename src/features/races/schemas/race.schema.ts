import { z } from "zod";
import {
  numberOptional,
  stringOptional,
  stringRequired,
} from "@/src/utils/custom-schema-validations";

export const RaceSchema = z.object({
  id: numberOptional,
  name: stringRequired,
  description: stringOptional,
});

export type IRace = z.infer<typeof RaceSchema>;
