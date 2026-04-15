import { z } from "zod";
import { stringRequired } from "@/src/utils/custom-schema-validations";
import { UserSchema } from "@/src/features/users/schemas/user.schema";

export const LoginRequestSchema = z.object({
  login: stringRequired,
  password: stringRequired,
});

export const TokenResponseSchema = z.object({
  type: z.string(),
  value: z.string(),
  expiration: z.coerce.date(),
});

export const LoginResponseSchema = z.object({
  user: UserSchema,
  token: TokenResponseSchema,
});

export type ILoginRequest = z.infer<typeof LoginRequestSchema>;
export type ILoginResponse = z.infer<typeof LoginResponseSchema>;

export const isAdminAuthType = (type: string | null | undefined) =>
  String(type ?? "")
    .trim()
    .toLowerCase() === "admin";
