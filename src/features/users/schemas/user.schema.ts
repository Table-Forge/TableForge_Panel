import { z } from "zod";

const asOptionalNumber = z.preprocess((value) => {
  if (value === null || value === undefined || value === "") return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}, z.number().optional());

const asOptionalDate = z
  .union([z.coerce.date(), z.string(), z.number(), z.null(), z.undefined()])
  .transform((value) => {
    if (value instanceof Date) return value;
    if (!value) return undefined;

    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? undefined : parsed;
  });

const asOptionalString = z.preprocess((value) => {
  if (value === null || value === undefined) return undefined;

  if (typeof value !== "string") {
    return String(value);
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}, z.string().optional());

const maybeString = asOptionalString;
const maybeEmail = asOptionalString;

export const UserSchema = z.object({
  id: asOptionalNumber,
  username: maybeString,
  nickname: maybeString,
  email: maybeEmail,
  gender: maybeString,
  birthDate: asOptionalDate,
  avatarUrl: maybeString,
  createdAt: asOptionalDate,
  status: maybeString,
});

export const UserCreateSchema = z
  .object({
    username: z.string().trim().min(1, "Usuário obrigatório"),
    nickname: z.string().trim().min(1, "Nickname obrigatório"),
    email: z.string().trim().email("E-mail inválido"),
    gender: z.string().trim().optional(),
    birthDate: z.coerce.date(),
    avatarUrl: z.string().trim().optional(),
    password: z.string().trim().min(6, "A senha deve ter ao menos 6 caracteres"),
    confirmPassword: z.string().trim().min(1, "Confirme a senha"),
  })
  .superRefine((data, context) => {
    if (data.password !== data.confirmPassword) {
      context.addIssue({
        code: "custom",
        message: "As senhas devem ser iguais.",
        path: ["confirmPassword"],
      });
    }
  });

export const UserUpdateSchema = UserSchema.partial().extend({
  id: asOptionalNumber,
});

export const RecoverPasswordSchema = z.object({
  email: z.string().trim().email("E-mail inválido"),
});

export const UpdatePasswordSchema = z
  .object({
    userId: z.number(),
    currentPassword: z.string().trim().min(1, "Senha atual obrigatória"),
    newPassword: z.string().trim().min(6, "Nova senha deve ter ao menos 6 caracteres"),
    confirmPassword: z.string().trim().min(1, "Confirme a nova senha"),
  })
  .superRefine(({ newPassword, confirmPassword }, context) => {
    if (newPassword !== confirmPassword) {
      context.addIssue({
        code: "custom",
        message: "Os novos segredos não coincidem.",
        path: ["confirmPassword"],
      });
    }
  });

export type IUser = z.infer<typeof UserSchema>;
export type IRecoverPassword = z.infer<typeof RecoverPasswordSchema>;
export type IUpdatePassword = z.infer<typeof UpdatePasswordSchema>;
export type IUserCreateInput = z.infer<typeof UserCreateSchema>;
export type IUserUpdateInput = z.input<typeof UserUpdateSchema>;
export type IUserUpdateOutput = z.infer<typeof UserUpdateSchema>;
