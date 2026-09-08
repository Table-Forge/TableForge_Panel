import { z } from "zod";
import {
  emailRequired,
  getPasswordError,
  stringRequired,
} from "@/src/utils/custom-schema-validations";

export const LoginRequestSchema = z.object({
  login: stringRequired,
  password: stringRequired,
});

export const RECOVERY_CODE_LENGTH = 6;
export const RESEND_COOLDOWN_SECONDS = 120;
export const PasswordRecoveryStepSchema = z.union([
  z.literal(1),
  z.literal(2),
  z.literal(3),
]);

export const PasswordRecoveryFormSchema = z
  .object({
    step: PasswordRecoveryStepSchema,
    email: emailRequired,
    code: z.string().trim().optional(),
    newPassword: z.string().trim().optional(),
    confirmPassword: z.string().trim().optional(),
  })
  .superRefine(({ step, code, newPassword, confirmPassword }, context) => {
    const normalizedCode = (code ?? "").trim();
    const normalizedPassword = (newPassword ?? "").trim();
    const normalizedConfirmPassword = (confirmPassword ?? "").trim();

    if (step >= 2) {
      if (!normalizedCode) {
        context.addIssue({
          code: "custom",
          message: "Campo obrigatório.",
          path: ["code"],
        });
      } else if (!/^\d+$/.test(normalizedCode)) {
        context.addIssue({
          code: "custom",
          message: "O código deve conter apenas números",
          path: ["code"],
        });
      } else if (normalizedCode.length !== RECOVERY_CODE_LENGTH) {
        context.addIssue({
          code: "custom",
          message: "Digite os 6 dígitos do código",
          path: ["code"],
        });
      }
    }

    if (step >= 3) {
      if (!normalizedPassword) {
        context.addIssue({
          code: "custom",
          message: "Campo obrigatório.",
          path: ["newPassword"],
        });
      } else {
        const passwordError = getPasswordError(normalizedPassword);
        if (passwordError) {
          context.addIssue({
            code: "custom",
            message: passwordError,
            path: ["newPassword"],
          });
        }
      }

      if (!normalizedConfirmPassword) {
        context.addIssue({
          code: "custom",
          message: "Campo obrigatório.",
          path: ["confirmPassword"],
        });
      } else if (normalizedPassword !== normalizedConfirmPassword) {
        context.addIssue({
          code: "custom",
          message: "As senhas devem ser iguais.",
          path: ["confirmPassword"],
        });
      }
    }
  });

export const TokenResponseSchema = z.object({
  type: z.string().optional(),
  value: z.string(),
  expiration: z.coerce.date(),
});

export const AuthUserSchema = z
  .object({
    id: z.coerce.number().optional(),
    username: z.string().optional().nullable(),
    type: z.string().optional().nullable(),
    nickname: z.string().optional().nullable(),
    email: z.string().optional().nullable(),
    avatarUrl: z.string().optional().nullable(),
  })
  .passthrough();

export const LoginResponseSchema = z.object({
  user: AuthUserSchema.optional(),
  token: TokenResponseSchema,
});

export type ILoginRequest = z.infer<typeof LoginRequestSchema>;
export type ILoginResponse = z.infer<typeof LoginResponseSchema>;
export type IPasswordRecoveryForm = z.infer<typeof PasswordRecoveryFormSchema>;

export const ValidationStepSchema = z.union([z.literal(1), z.literal(2)]);

export const ValidationFormSchema = z
  .object({
    step: ValidationStepSchema,
    email: emailRequired,
    code: z.string().trim().optional(),
  })
  .superRefine(({ step, code }, ctx) => {
    const normalizedCode = (code ?? "").trim();

    if (step === 2) {
      if (!normalizedCode) {
        ctx.addIssue({
          code: "custom",
          message: "Campo obrigatório.",
          path: ["code"],
        });
      } else if (!/^\d+$/.test(normalizedCode)) {
        ctx.addIssue({
          code: "custom",
          message: "O código deve conter apenas números.",
          path: ["code"],
        });
      } else if (normalizedCode.length !== RECOVERY_CODE_LENGTH) {
        ctx.addIssue({
          code: "custom",
          message: "Digite os 6 dígitos do código.",
          path: ["code"],
        });
      }
    }
  });

export type IValidationForm = z.infer<typeof ValidationFormSchema>;

export const isAdminAuthType = (type: string | null | undefined) =>
  String(type ?? "")
    .trim()
    .toLowerCase() === "admin";
