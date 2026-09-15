import { z } from "zod";

export const TermsAudienceSchema = z.enum(["None", "Users", "BusinessPartner"]);
export type ITermsAudience = z.infer<typeof TermsAudienceSchema>;

export const TermsStatusSchema = z.enum([
  "None",
  "PendingApproval",
  "Active",
  "Deprecated",
]);
export type ITermsStatus = z.infer<typeof TermsStatusSchema>;

export const TermsDocumentListSchema = z.object({
  id: z.number(),
  audience: z.string(),
  version: z.number(),
  title: z.string(),
  status: z.string(),
  createdAt: z.string(),
  createdByName: z.string().nullish(),
  approvedAt: z.string().nullish(),
  approvedByName: z.string().nullish(),
  acceptanceCount: z.number().nullish(),
  hasFile: z.boolean().default(false),
});
export type ITermsDocumentList = z.infer<typeof TermsDocumentListSchema>;

export const TermsDocumentSchema = z.object({
  id: z.number(),
  createdAt: z.string(),
  audience: z.string(),
  version: z.number(),
  title: z.string(),
  status: z.string(),
  contentHtml: z.string().nullish(),
  fileUrl: z.string().nullish(),
  fileName: z.string().nullish(),
  fileSizeBytes: z.number().nullish(),
  createdById: z.number().optional(),
  createdByName: z.string().nullish(),
  approvedById: z.number().nullish(),
  approvedByName: z.string().nullish(),
  approvedAt: z.string().nullish(),
  deprecatedAt: z.string().nullish(),
  acceptanceCount: z.number().nullish(),
  canEdit: z.boolean().default(false),
  canApprove: z.boolean().default(false),
  canDeprecate: z.boolean().default(false),
  canDelete: z.boolean().default(false),
});
export type ITermsDocument = z.infer<typeof TermsDocumentSchema>;

export const TermsAcceptanceListSchema = z.object({
  id: z.number(),
  userId: z.number(),
  userName: z.string(),
  userEmail: z.string(),
  acceptedAt: z.string(),
  version: z.number(),
  ipAddress: z.string(),
  userAgent: z.string().nullish(),
  latitude: z.number().nullish(),
  longitude: z.number().nullish(),
});
export type ITermsAcceptanceList = z.infer<typeof TermsAcceptanceListSchema>;

export const TermsFormSchema = z
  .object({
    audience: z.string().min(1, "O público é obrigatório"),
    title: z
      .string()
      .trim()
      .min(1, "O título é obrigatório")
      .max(150, "O título deve ter no máximo 150 caracteres"),
    contentType: z.enum(["pdf", "html"]),
    contentHtml: z.string().optional(),
    file: z.any().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.contentType === "html") {
      const html = (data.contentHtml ?? "").trim();
      if (!html) {
        ctx.addIssue({
          code: "custom",
          message: "O conteúdo HTML é obrigatório",
          path: ["contentHtml"],
        });
      } else if (html.length > 120000) {
        ctx.addIssue({
          code: "custom",
          message: "O conteúdo do contrato deve ter no máximo 120000 caracteres",
          path: ["contentHtml"],
        });
      }
    }

    if (data.contentType === "pdf") {
      if (data.file instanceof File) {
        if (data.file.size > 10 * 1024 * 1024) {
          ctx.addIssue({
            code: "custom",
            message: "O arquivo PDF deve ter no máximo 10 MB",
            path: ["file"],
          });
        }
      }
    }
  });

export type ITermsFormData = z.infer<typeof TermsFormSchema>;
