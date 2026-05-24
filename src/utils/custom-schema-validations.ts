import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { z, type RefinementCtx } from "zod";
import {
  ERROR_MESSAGE,
  FILE_ERROR_MESSAGE,
} from "@/src/components/error-message/error-message.constant";
import { validateCNPJ, validateCPF } from "@/src/utils/validate";

dayjs.extend(customParseFormat);

const stringRequired = z.preprocess(
  (arg) => {
    if (arg === null || arg === undefined) return "";
    return String(arg);
  },
  z.string().refine((val) => val.trim() !== "", {
    message: ERROR_MESSAGE.required,
  }),
);

const numberRequired = z.preprocess(
  (arg) => {
    if (arg === null || arg === undefined || arg === "") return NaN;
    return arg;
  },
  z.coerce.number().refine((val) => Number.isFinite(val) && val > 0, {
    message: ERROR_MESSAGE.required,
  }),
);

const stringOrStringArrayRequired = z.union([
  z.string().min(1, ERROR_MESSAGE.required),
  z.array(z.string()).refine((arr) => arr.length > 0, {
    message: ERROR_MESSAGE.required,
  }),
]);

const numberOrStringRequired = z.union([
  z.number().refine((val) => val > 0, { message: ERROR_MESSAGE.required }),
  z
    .string()
    .refine((val) => val.trim() !== "", { message: ERROR_MESSAGE.required }),
]);

const stringArrayRequired = z
  .array(z.coerce.string())
  .default([])
  .refine((val) => val.length > 0, {
    message: ERROR_MESSAGE.required,
  });

const numberArrayRequired = z
  .array(z.coerce.number())
  .default([])
  .refine((val) => val.length > 0, {
    message: ERROR_MESSAGE.required,
  });

const dateRequired = z.preprocess(
  (arg) => {
    if (arg === null || arg === undefined || arg === "") return "";

    if (arg instanceof Date) {
      if (Number.isNaN(arg.getTime())) return "invalid";
      return arg.toISOString().split("T")[0];
    }

    return arg;
  },
  z.union([
    z
      .string()
      .trim()
      .nonempty(ERROR_MESSAGE.required)
      .refine((val) => dayjs(val, "YYYY-MM-DD", true).isValid(), {
        message: ERROR_MESSAGE.validate,
      }),
    z.date().refine((val) => !Number.isNaN(val.getTime()), {
      message: ERROR_MESSAGE.validate,
    }),
  ]),
);

const emailRequired = z.preprocess(
  (arg) => (typeof arg === "string" ? arg.trim() : ""),
  z
    .string()
    .min(1, { message: ERROR_MESSAGE.required })
    .email({ message: "Formato de e-mail inválido" }),
);

const emailOptional = z.preprocess(
  (arg) => {
    if (arg === null || arg === undefined) return undefined;
    const value = String(arg).trim();
    if (value === "") return undefined;
    return value;
  },
  z.string().email({ message: "Formato de e-mail inválido" }).optional(),
);

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_FILE_TYPES = ["application/pdf", "image/jpeg", "image/png"];

const fileSchema = z
  .instanceof(File)
  .refine((file) => ACCEPTED_FILE_TYPES.includes(file.type), {
    message: FILE_ERROR_MESSAGE.invalidType,
  })
  .refine((file) => file.size <= MAX_FILE_SIZE, {
    message: FILE_ERROR_MESSAGE.maxFileSize,
  });

const fileListRequired = z
  .array(fileSchema)
  .min(1, { message: FILE_ERROR_MESSAGE.requiredFile });

const fileRequired = z.any().superRefine((file, ctx) => {
  if (!(file instanceof File)) {
    ctx.addIssue({
      code: "custom",
      message: ERROR_MESSAGE.required,
    });
    return;
  }

  if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
    ctx.addIssue({
      code: "custom",
      message: FILE_ERROR_MESSAGE.invalidType,
    });
  }

  if (file.size > MAX_FILE_SIZE) {
    ctx.addIssue({
      code: "custom",
      message: FILE_ERROR_MESSAGE.maxFileSize,
    });
  }
});

const cpfCnpjValidation = z.preprocess(
  (arg) => {
    if (typeof arg === "string") {
      const trimmed = arg.trim();
      if (trimmed === "") return undefined;
      return arg;
    }
    return arg;
  },
  z
    .string({
      message: "Documento é obrigatório.",
    })
    .refine((doc) => doc.replace(/\D/g, "").length >= 11, {
      message: "Documento deve conter no mínimo 11 caracteres.",
    })
    .refine((doc) => doc.replace(/\D/g, "").length <= 14, {
      message: "Documento deve conter no máximo 14 caracteres.",
    })
    .refine((doc) => {
      const replacedDoc = doc.replace(/\D/g, "");
      if (replacedDoc.length === 11) return validateCPF(replacedDoc);
      if (replacedDoc.length === 14) return validateCNPJ(replacedDoc);
      return false;
    }, "Documento inválido."),
);

const cpfValidation = z
  .string({ message: "CPF é obrigatório." })
  .transform((value) => value.trim())
  .refine((value) => value !== "", { message: "CPF é obrigatório." })
  .refine((value) => value.replace(/\D/g, "").length === 11, {
    message: "CPF deve conter 11 dígitos.",
  })
  .refine((value) => validateCPF(value), {
    message: "CPF inválido.",
  });

const addIssuesIfInvalid = (
  ctx: RefinementCtx,
  value: unknown,
  schema: z.ZodType<unknown>,
  path: (string | number)[],
) => {
  const result = schema.safeParse(value);

  if (!result.success) {
    result.error.issues.forEach((issue) => {
      ctx.addIssue({
        ...issue,
        path: [...path, ...issue.path],
      });
    });
  }
};

const numberOptional = z.preprocess((arg) => {
  if (arg === null || arg === undefined || arg === "") return undefined;
  const parsed = Number(arg);
  return Number.isFinite(parsed) ? parsed : undefined;
}, z.number().optional());

const stringOptional = z.preprocess((arg) => {
  if (arg === null || arg === undefined) return undefined;
  const value = String(arg).trim();
  return value === "" ? undefined : value;
}, z.string().optional());

const imageUrlOptional = z.preprocess((arg) => {
  if (arg === null || arg === undefined) return undefined;
  return String(arg).trim();
}, z.string().optional());

const dateOptional = z.preprocess((arg) => {
  if (typeof arg === "string" && arg.trim() === "") return undefined;
  if (arg === null || arg === undefined) return undefined;
  return arg;
}, z.coerce.date().optional());

const stringOrStringArrayOptional = z
  .union([z.string(), z.array(z.string())])
  .optional();

const numberArrayOptional = z.array(z.number()).default([]).optional();

const fileArrayOptional = z.array(fileSchema).optional();

export {
  addIssuesIfInvalid,
  cpfCnpjValidation,
  cpfValidation,
  dateOptional,
  dateRequired,
  emailOptional,
  emailRequired,
  fileArrayOptional,
  fileListRequired,
  fileRequired,
  fileSchema,
  imageUrlOptional,
  numberArrayOptional,
  numberArrayRequired,
  numberOptional,
  numberOrStringRequired,
  numberRequired,
  stringArrayRequired,
  stringOptional,
  stringOrStringArrayOptional,
  stringOrStringArrayRequired,
  stringRequired,
};
