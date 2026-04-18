import { z } from "zod";
import {
  dateOptional,
  numberOptional,
  stringOptional,
} from "@/src/utils/custom-schema-validations";

export const LogSchema = z.object({
  id: numberOptional,
  dateCreated: dateOptional,
  createdAt: dateOptional,
  code: stringOptional,
  type: stringOptional,
  message: stringOptional,
  endpoint: stringOptional,
  statusCode: numberOptional,
  ipAddress: stringOptional,
  userId: numberOptional,
  details: stringOptional,
  stackTrace: stringOptional,
  innerExceptionMessage: stringOptional,
  innerExceptionStackTrace: stringOptional,
});

export type ILog = z.infer<typeof LogSchema>;
