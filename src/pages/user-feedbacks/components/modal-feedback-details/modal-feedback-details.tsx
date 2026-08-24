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
import { ModalImageCarousel } from "@/src/components/modals/modal-image-carousel/modal-image-carousel";
import { UserFeedbackCategory } from "@/src/features/user-feedbacks/enums";
import {
  useUserFeedbackCategoryEnum,
  useUserFeedbackStatusEnum,
} from "@/src/features/user-feedbacks/hooks/enums/use-user-feedback-enums";
import { useUserFeedbacksMutations } from "@/src/features/user-feedbacks/hooks/use-user-feedbacks-mutations";
import { useUserFeedbackDetailsQuery } from "@/src/features/user-feedbacks/hooks/use-user-feedbacks-queries";
import { UserFeedbackStatusUpdateSchema } from "@/src/features/user-feedbacks/schemas/user-feedback.schema";
import type { IUserFeedbackStatusUpdate } from "@/src/features/user-feedbacks/schemas/user-feedback.schema";
import { useBoundStore } from "@/src/store";

interface ModalFeedbackDetailsProps {
  feedbackId: number;
}

export function ModalFeedbackDetails({ feedbackId }: ModalFeedbackDetailsProps) {
  const openModal = useBoundStore((state) => state.openModal);
  const closeModal = useBoundStore((state) => state.closeModal);
  const addToast = useBoundStore((state) => state.addToast);

  const { statusEnum, isLoadingStatusEnum } = useUserFeedbackStatusEnum();
  const { categoryEnum } = useUserFeedbackCategoryEnum(true, false);
  const { data: feedback, isLoading } = useUserFeedbackDetailsQuery(feedbackId);
  const { updateStatusMutation, isUpdatingStatus } = useUserFeedbacksMutations();

  const categoryOption = feedback ? categoryEnum.find((item) => item.value === feedback.category) : undefined;

  const handleOpenImageModal = (initialIndex: number) => {
    if (!feedback?.images?.length) return;
    openModal(
      "Visualização de Anexos",
      <ModalImageCarousel images={feedback.images} initialIndex={initialIndex} />,
      "md"
    );
  };

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
          <div className="flex items-center gap-1"><MdLayers /> {categoryOption?.name || feedback.category}</div>
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
            {feedback.images.map((img, index) => (
              <button
                key={img.id}
                type="button"
                onClick={() => handleOpenImageModal(index)}
                className="block h-24 w-24 overflow-hidden rounded-lg border border-grays-700 hover:border-accent transition-all cursor-pointer"
              >
                <img
                  src={img.url}
                  alt={`Anexo ${index + 1}`}
                  className="h-full w-full object-cover transition-transform hover:scale-110"
                />
              </button>
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
              initialOptions={statusEnum}
              isLoading={isLoadingStatusEnum}
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
