import {
  dateOptional,
  dateRequired,
  emailOptional,
  emailRequired,
  numberOptional,
  numberRequired,
  stringOptional,
  stringRequired,
} from "@/src/utils/custom-schema-validations";
import { z } from "zod";

const BaseUserSchema = z.object({
  id: numberOptional,
  username: stringOptional,
  nickname: stringOptional,
  email: emailOptional,
  gender: stringOptional,
  birthDate: dateOptional,
  avatarUrl: stringOptional,
  createdAt: dateOptional,
  status: stringOptional,
});

export const UserSchema = BaseUserSchema;

export const UserCreateSchema = z
  .object({
    id: z.number().optional(),
    username: stringRequired,
    nickname: stringRequired,
    email: emailRequired,
    gender: stringOptional,
    birthDate: dateRequired,
    avatarUrl: stringOptional,
    password: z
      .string()
      .trim()
      .min(6, "A senha deve ter ao menos 6 caracteres"),
    confirmPassword: stringRequired,
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

export const UserUpdateSchema = BaseUserSchema.partial().extend({
  id: numberOptional,
});

export const RecoverPasswordSchema = z.object({
  email: emailRequired,
});

export const UpdatePasswordSchema = z
  .object({
    userId: numberRequired,
    currentPassword: stringRequired,
    newPassword: z
      .string()
      .trim()
      .min(6, "Nova senha deve ter ao menos 6 caracteres"),
    confirmPassword: stringRequired,
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
