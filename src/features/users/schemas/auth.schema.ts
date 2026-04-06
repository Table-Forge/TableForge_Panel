import { z } from "zod";
import { UserSchema } from "@/src/features/users/schemas/user.schema";

export const LoginRequestSchema = z.object({
  login: z.string().trim().min(1, "O login é obrigatório"),
  password: z.string().trim().min(1, "A senha é obrigatória"),
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
