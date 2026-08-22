import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { MdPhoneIphone, MdLayers, MdStar } from "react-icons/md";

import { Button } from "@/src/components/button/button";
import { FieldsWrapper } from "@/src/components/fields-wrapper/fields-wrapper";
import { InputGroup } from "@/src/components/input-group/input-group";
import { Label } from "@/src/components/label/label";
import { Select } from "@/src/components/select/select";
import { ControlledTextarea } from "@/src/components/input/input.textarea.controlled";
import { UserFeedbackCategory, UserFeedbackStatus } from "@/src/features/user-feedbacks/enums";
import { useUserFeedbacksMutations } from "@/src/features/user-feedbacks/hooks/use-user-feedbacks-mutations";
import { useUserFeedbackDetailsQuery } from "@/src/features/user-feedbacks/hooks/use-user-feedbacks-queries";
import { UserFeedbackStatusUpdateSchema } from "@/src/features/user-feedbacks/schemas/user-feedback.schema";
import type { IUserFeedbackStatusUpdate } from "@/src/features/user-feedbacks/schemas/user-feedback.schema";
import { useBoundStore } from "@/src/store";

interface ModalFeedbackDetailsProps {
  feedbackId: number;
}

const STATUS_OPTIONS = [
  { value: UserFeedbackStatus.InAnalysis, name: "Em análise" },
  { value: UserFeedbackStatus.Planned, name: "Planejado" },
  { value: UserFeedbackStatus.Resolved, name: "Resolvido" },
  { value: UserFeedbackStatus.Declined, name: "Não será implementado" },
  { value: UserFeedbackStatus.Duplicated, name: "Duplicado" },
];

export function ModalFeedbackDetails({ feedbackId }: ModalFeedbackDetailsProps) {
  const closeModal = useBoundStore((state) => state.closeModal);
  const addToast = useBoundStore((state) => state.addToast);

  const { data: feedback, isLoading } = useUserFeedbackDetailsQuery(feedbackId);
  const { updateStatusMutation, isUpdatingStatus } = useUserFeedbacksMutations();

  const hookForm = useForm<IUserFeedbackStatusUpdate>({
    resolver: zodResolver(UserFeedbackStatusUpdateSchema),
    defaultValues: {
      status: undefined,
      priority: undefined,
      response: "",
    },
  });

  useEffect(() => {
    if (feedback) {
      hookForm.reset({
        status: feedback.status,
        priority: feedback.priority,
        response: feedback.adminResponse || "",
      });
    }
  }, [feedback, hookForm]);

  const onSubmit = async (data: IUserFeedbackStatusUpdate) => {
    try {
      await updateStatusMutation.mutateAsync({ id: feedbackId, payload: data });
      addToast("success", "Feedback atualizado com sucesso!");
      closeModal();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      addToast("error", err?.response?.data?.message || "Erro ao atualizar feedback.");
    }
  };

  if (isLoading || !feedback) {
    return <div className="p-8 text-center text-grays-200">Carregando detalhes...</div>;
  }

  return (
    <form onSubmit={hookForm.handleSubmit(onSubmit)} className="flex flex-col gap-6">
      {/* Header Info */}
      <div className="flex flex-col gap-2 rounded-xl bg-grays-800 p-4 border border-grays-700">
        <h3 className="text-lg font-bold text-grays-50">{feedback.title}</h3>
        <p className="text-sm text-grays-200">{feedback.content}</p>

        <div className="mt-4 flex flex-wrap gap-4 border-t border-grays-700 pt-4 text-xs text-grays-300">
          <div className="flex items-center gap-1"><MdLayers /> {feedback.category}</div>
          {feedback.category === UserFeedbackCategory.Experience && feedback.rating && (
            <div className="flex items-center gap-1 text-warning"><MdStar /> {feedback.rating} / 5</div>
          )}
          <div className="flex items-center gap-1"><MdPhoneIphone /> {feedback.platform || "Desconhecido"}</div>
          {feedback.appVersion && <div className="flex items-center gap-1">v{feedback.appVersion}</div>}
          <div className="flex items-center gap-1">
            Enviado por: {feedback.userName} ({dayjs(feedback.createdAt).format("DD/MM/YYYY HH:mm")})
          </div>
        </div>
        {feedback.deviceInfo && (
          <div className="text-xs text-grays-400 mt-2">Device: {feedback.deviceInfo}</div>
        )}
      </div>

      {/* Images Gallery */}
      {feedback.images && feedback.images.length > 0 && (
        <div className="flex flex-col gap-2">
          <span className="text-sm font-bold text-grays-100">Anexos ({feedback.images.length})</span>
          <div className="flex flex-wrap gap-3">
            {feedback.images.map((img) => (
              <a
                key={img.id}
                href={img.url}
                target="_blank"
                rel="noreferrer"
                className="block h-24 w-24 overflow-hidden rounded-lg border border-grays-700"
              >
                <img
                  src={img.url}
                  alt="Anexo"
                  className="h-full w-full object-cover transition-transform hover:scale-110"
                />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Triagem Form */}
      <div className="flex flex-col gap-4 border-t border-grays-700 pt-6">
        <span className="text-sm font-bold text-grays-100">Triagem e Resposta</span>

        <FieldsWrapper>
          <InputGroup>
            <Label htmlFor="status" isRequired>Situação</Label>
            <Select
              hookForm={hookForm}
              name="status"
              initialOptions={STATUS_OPTIONS}
              title="Selecione o novo status"
            />
          </InputGroup>
        </FieldsWrapper>

        <InputGroup>
          <Label htmlFor="response">Resposta ao Usuário</Label>
          <ControlledTextarea
            hookForm={hookForm}
            name="response"
            placeholder="Escreva a resposta ou justificativa..."
            rows={3}
          />
        </InputGroup>

        <div className="mt-4 flex justify-end gap-3">
          <Button type="button" buttonStyle="soft" onClick={closeModal}>
            Cancelar
          </Button>
          <Button type="submit" isLoading={isUpdatingStatus}>
            Salvar Alterações
          </Button>
        </div>
      </div>
    </form>
  );
}
