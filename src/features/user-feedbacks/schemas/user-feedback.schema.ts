import { z } from "zod";
import { UserFeedbackStatus, UserFeedbackPriority } from "../enums";

export const UserFeedbackStatusUpdateSchema = z
  .object({
    status: z.nativeEnum(UserFeedbackStatus),
    priority: z.nativeEnum(UserFeedbackPriority).optional(),
    response: z.string().max(2000, "A resposta deve ter no máximo 2000 caracteres").optional(),
  })
  .refine(
    (data) => {
      if (data.status === UserFeedbackStatus.New) {
        return false;
      }
      return true;
    },
    {
      message: "A situação 'Novo' é o estado de entrada do feedback e não pode ser aplicada na triagem!",
      path: ["status"],
    }
  )
  .refine(
    (data) => {
      if (data.status === UserFeedbackStatus.Declined && (!data.response || data.response.trim() === "")) {
        return false;
      }
      return true;
    },
    {
      message: "Informe o motivo ao marcar o feedback como 'Não será implementado'!",
      path: ["response"],
    }
  );

export type IUserFeedbackStatusUpdate = z.infer<typeof UserFeedbackStatusUpdateSchema>;
