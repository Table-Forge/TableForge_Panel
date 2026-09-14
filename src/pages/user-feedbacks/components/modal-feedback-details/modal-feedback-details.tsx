import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { MdPhoneIphone, MdLayers, MdStar, MdForum } from "react-icons/md";

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
import { handleError } from "@/src/utils/error-handler";

interface ModalFeedbackDetailsProps {
  feedbackId: number;
}

export function ModalFeedbackDetails({ feedbackId }: ModalFeedbackDetailsProps) {
  const openModal = useBoundStore((state) => state.openModal);
  const closeModal = useBoundStore((state) => state.closeModal);
  const addToast = useBoundStore((state) => state.addToast);

  const [threadMessage, setThreadMessage] = useState("");

  const { statusEnum, isLoadingStatusEnum } = useUserFeedbackStatusEnum();
  const { categoryEnum } = useUserFeedbackCategoryEnum(true, false);
  const { data: feedback, isLoading } = useUserFeedbackDetailsQuery(feedbackId);
  const {
    updateStatusMutation,
    isUpdatingStatus,
    sendMessageMutation,
    isSendingMessage,
  } = useUserFeedbacksMutations();

  const categoryOption = feedback ? categoryEnum.find((item) => item.value === feedback.category) : undefined;

  const handleOpenImageModal = (images: { id: number; url: string }[], initialIndex: number) => {
    if (!images?.length) return;
    openModal(
      "Visualização de Anexos",
      <ModalImageCarousel images={images} initialIndex={initialIndex} />,
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
      handleError(error);
    }
  };

  const handleSendThreadMessage = async () => {
    const content = threadMessage.trim();
    if (!content) return;

    try {
      await sendMessageMutation.mutateAsync({
        id: feedbackId,
        payload: { content },
      });
      setThreadMessage("");
      addToast("success", "Mensagem enviada na conversa com sucesso!");
    } catch (error: unknown) {
      handleError(error);
    }
  };

  if (isLoading || !feedback) {
    return <div className="p-8 text-center text-grays-200">Carregando detalhes...</div>;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 rounded-xl bg-grays-800 p-4 border border-grays-700">
        <h3 className="text-lg font-bold text-grays-50">{feedback.title}</h3>
        <p className="text-sm text-grays-200 leading-relaxed">{feedback.content}</p>

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

      {feedback.images && feedback.images.length > 0 && (
        <div className="flex flex-col gap-2">
          <span className="text-sm font-bold text-grays-100">Anexos do Relato ({feedback.images.length})</span>
          <div className="flex flex-wrap gap-3">
            {feedback.images.map((img, index) => (
              <button
                key={img.id}
                type="button"
                onClick={() => handleOpenImageModal(feedback.images, index)}
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

      <div className="flex flex-col gap-3 border-t border-grays-700 pt-6">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-grays-100 flex items-center gap-2">
            <MdForum className="text-accent text-base" />
            Conversa com o Usuário ({feedback.messages?.length || 0})
          </span>
          {feedback.reopensOnNewMessage && (
            <span className="text-xs text-warning bg-warning/10 border border-warning/30 px-2.5 py-0.5 rounded">
              Encerrado (reabre se houver nova mensagem)
            </span>
          )}
        </div>

        {(!feedback.messages || feedback.messages.length === 0) ? (
          <div className="rounded-lg border border-grays-700 bg-grays-800/50 p-4 text-center text-xs text-grays-400">
            Nenhuma mensagem enviada até o momento.
          </div>
        ) : (
          <div className="flex flex-col gap-3 max-h-[320px] overflow-y-auto pr-1">
            {feedback.messages.map((msg) => {
              const isTeam = msg.isFromTeam;
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col rounded-xl p-3 text-sm ${
                    isTeam
                      ? "ml-6 border border-emerald-500/30 bg-emerald-950/20 text-grays-100"
                      : "mr-6 border border-grays-700 bg-grays-800 text-grays-200"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5 text-xs">
                    <span className={`font-semibold ${isTeam ? "text-emerald-400" : "text-accent"}`}>
                      {msg.userName || (isTeam ? "Equipe TableForge" : "Usuário")}
                    </span>
                    <span className="text-grays-400 text-[11px]">
                      {dayjs(msg.createdAt).format("DD/MM/YYYY HH:mm")}
                    </span>
                  </div>
                  <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>

                  {msg.images && msg.images.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2 border-t border-white/5 pt-2">
                      {msg.images.map((img, imgIdx) => (
                        <button
                          key={img.id}
                          type="button"
                          onClick={() => handleOpenImageModal(msg.images, imgIdx)}
                          className="h-16 w-16 overflow-hidden rounded-lg border border-grays-700 hover:border-accent transition-all cursor-pointer"
                        >
                          <img
                            src={img.url}
                            alt={`Anexo ${imgIdx + 1}`}
                            className="h-full w-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <div className="flex flex-col gap-2 rounded-xl border border-grays-700 bg-grays-800/60 p-3 mt-1">
          <label htmlFor="threadMessage" className="text-xs font-semibold text-grays-200">
            Responder na Conversa (sem alterar a situação)
          </label>
          <textarea
            id="threadMessage"
            value={threadMessage}
            onChange={(e) => setThreadMessage(e.target.value)}
            placeholder="Digite uma mensagem para o usuário na conversa..."
            maxLength={2000}
            rows={2}
            className="w-full rounded-lg border border-grays-700 bg-grays-900 p-2 text-sm text-grays-100 placeholder-grays-500 focus:border-accent focus:outline-none resize-none"
          />
          <div className="flex items-center justify-between text-xs text-grays-400">
            <span>{threadMessage.length} / 2000</span>
            <Button
              type="button"
              buttonStyle="secondary"
              disabled={!threadMessage.trim() || isSendingMessage}
              isLoading={isSendingMessage}
              onClick={handleSendThreadMessage}
              className="py-1 px-3 text-xs"
            >
              Enviar na Conversa
            </Button>
          </div>
        </div>
      </div>

      <form onSubmit={hookForm.handleSubmit(onSubmit)} className="flex flex-col gap-4 border-t border-grays-700 pt-6">
        <span className="text-sm font-bold text-grays-100">Triagem / Situação</span>

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
          <Label htmlFor="response">Resposta / Motivo (entra também na conversa)</Label>
          <ControlledTextarea
            hookForm={hookForm}
            name="response"
            placeholder="Escreva a resposta ou justificativa ao mudar a situação..."
            rows={3}
          />
        </InputGroup>

        <div className="mt-4 flex justify-end gap-3">
          <Button type="button" buttonStyle="soft" onClick={closeModal}>
            Fechar
          </Button>
          <Button type="submit" isLoading={isUpdatingStatus}>
            Salvar Triagem
          </Button>
        </div>
      </form>
    </div>
  );
}
