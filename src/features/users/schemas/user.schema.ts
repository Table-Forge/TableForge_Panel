import {
  dateOptional,
  dateRequired,
  emailOptional,
  emailRequired,
  imageUrlOptional,
  numberOptional,
  numberRequired,
  stringOptional,
  stringRequired,
} from "@/src/utils/custom-schema-validations";
import { z } from "zod";

const BaseUserSchema = z.object({
  id: numberOptional,
  username: stringOptional,
  type: stringOptional,
  nickname: stringOptional,
  email: emailOptional,
  gender: stringOptional,
  birthDate: dateOptional,
  avatarUrl: imageUrlOptional,
  password: stringOptional,
  confirmPassword: stringOptional,
  createdAt: dateOptional,
  status: stringOptional,
});

export const UserSchema = BaseUserSchema.superRefine((data, context) => {
  if (data.id) return;

  const password = data.password?.trim() ?? "";
  const confirmPassword = data.confirmPassword?.trim() ?? "";

  if (!data.birthDate) {
    context.addIssue({
      code: "custom",
      message: "Campo obrigatório.",
      path: ["birthDate"],
    });
  }

  if (!password) {
    context.addIssue({
      code: "custom",
      message: "Campo obrigatório.",
      path: ["password"],
    });
  } else if (password.length < 6) {
    context.addIssue({
      code: "custom",
      message: "A senha deve ter ao menos 6 caracteres.",
      path: ["password"],
    });
  }

  if (!confirmPassword) {
    context.addIssue({
      code: "custom",
      message: "Campo obrigatório.",
      path: ["confirmPassword"],
    });
  } else if (password !== confirmPassword) {
    context.addIssue({
      code: "custom",
      message: "As senhas devem ser iguais.",
      path: ["confirmPassword"],
    });
  }
});

export const UserCreateSchema = z
  .object({
    id: z.number().optional(),
    username: stringRequired,
    nickname: stringRequired,
    email: emailRequired,
    gender: stringOptional,
    birthDate: dateRequired,
    avatarUrl: imageUrlOptional,
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
        message: "As novas senhas não coincidem.",
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
