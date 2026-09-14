import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { ArrowLeft } from "lucide-react";
import {
  MdForum,
  MdLayers,
  MdPhoneIphone,
  MdSend,
  MdStar,
} from "react-icons/md";

import { Button } from "@/src/components/button/button";
import {
  CardBox,
  CardLabel,
  CardValue,
  GridBox,
  InfoBox,
} from "@/src/components/card-box/card-box";
import { FieldsWrapper } from "@/src/components/fields-wrapper/fields-wrapper";
import { InfoNotFound } from "@/src/components/page-handler/info-not-found";
import { InputGroup } from "@/src/components/input-group/input-group";
import { Label } from "@/src/components/label/label";
import { MatrixTag } from "@/src/components/matrix-tag/matrix-tag";
import { ModalImageCarousel } from "@/src/components/modals/modal-image-carousel/modal-image-carousel";
import { Select } from "@/src/components/select/select";
import { SkeletonDetails } from "@/src/components/skeleton/skeleton-details";
import { Thumbnail } from "@/src/components/thumbnail/thumbnail";
import { ControlledTextarea } from "@/src/components/input/input.textarea.controlled";
import {
  UserFeedbackCategory,
  UserFeedbackStatus,
} from "@/src/features/user-feedbacks/enums";
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

const getStatusColor = (status?: UserFeedbackStatus) => {
  switch (status) {
    case UserFeedbackStatus.New:
      return "#0ea5e9";
    case UserFeedbackStatus.InAnalysis:
      return "#f59e0b";
    case UserFeedbackStatus.Planned:
      return "#6366f1";
    case UserFeedbackStatus.Resolved:
      return "#10b981";
    case UserFeedbackStatus.Declined:
      return "#ef4444";
    case UserFeedbackStatus.Duplicated:
      return "#6b7280";
    default:
      return "#6b7280";
  }
};

export function UserFeedbackDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const openModal = useBoundStore((state) => state.openModal);
  const addToast = useBoundStore((state) => state.addToast);

  const [threadMessage, setThreadMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const feedbackId = useMemo(() => {
    const parsed = Number(id);
    return Number.isFinite(parsed) ? parsed : 0;
  }, [id]);

  const { data: feedback, isLoading, isError } = useUserFeedbackDetailsQuery(feedbackId);
  const { statusEnum, isLoadingStatusEnum } = useUserFeedbackStatusEnum();
  const { categoryEnum } = useUserFeedbackCategoryEnum(true, false);

  const {
    updateStatusMutation,
    isUpdatingStatus,
    sendMessageMutation,
    isSendingMessage,
  } = useUserFeedbacksMutations();

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

  useEffect(() => {
    if (feedback?.messages?.length) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [feedback?.messages?.length]);

  const handleOpenImageModal = (images: { id: number; url: string }[], initialIndex: number) => {
    if (!images?.length) return;
    openModal(
      "Visualização de Anexos",
      <ModalImageCarousel images={images} initialIndex={initialIndex} />,
      "md",
    );
  };

  const onSubmitStatus = async (data: IUserFeedbackStatusUpdate) => {
    try {
      await updateStatusMutation.mutateAsync({ id: feedbackId, payload: data });
      addToast("success", "Situação do feedback atualizada com sucesso!");
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
      addToast("success", "Mensagem enviada com sucesso!");
    } catch (error: unknown) {
      handleError(error);
    }
  };

  if (isLoading) return <SkeletonDetails />;
  if (isError || !feedback) {
    return <InfoNotFound message="Ocorreu um erro ao carregar os detalhes do feedback." />;
  }

  const categoryOption = categoryEnum.find((item) => item.value === feedback.category);
  const statusOption = statusEnum.find((item) => item.value === feedback.status);

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/user-feedbacks")}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-primary/60 text-white/80 transition-all hover:border-white/20 hover:bg-white/10 hover:text-white"
            title="Voltar para a fila"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold uppercase tracking-tight text-white">
                {feedback.title}
              </h1>
              <span className="rounded-full border border-white/10 bg-white/10 px-3 py-0.5 text-xs font-extrabold tracking-wide text-white/90">
                #{feedback.id}
              </span>
              <MatrixTag
                matrixName={statusOption?.name || feedback.status}
                lineColor={getStatusColor(feedback.status)}
              />
            </div>
            <p className="text-xs font-semibold text-grays-100">
              Enviado por {feedback.userName} • {dayjs(feedback.createdAt).format("DD/MM/YYYY [às] HH:mm")}
              {feedback.platform ? ` • Plataforma: ${feedback.platform}` : ""}
              {feedback.appVersion ? ` (v${feedback.appVersion})` : ""}
            </p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="flex flex-col gap-6 lg:col-span-5">
          <CardBox title="Informações do Usuário e Contexto">
            <div className="flex items-center gap-4 border-b border-white/10 pb-4">
              <Thumbnail
                image={undefined}
                width={52}
                height={52}
                rounded="full"
                alt={feedback.userName}
              />
              <div className="flex flex-col">
                <span className="text-base font-bold text-white">{feedback.userName}</span>
                <span className="text-xs text-grays-200">{feedback.userEmail || "E-mail não informado"}</span>
                <span className="text-[10px] text-grays-400 font-medium">ID de Usuário: #{feedback.userId}</span>
              </div>
            </div>

            <GridBox className="lg:grid-cols-2 mt-2">
              <InfoBox>
                <CardLabel>Categoria</CardLabel>
                <div className="mt-1 flex items-center gap-1 text-sm font-semibold text-white">
                  <MdLayers className="text-accent" />
                  {categoryOption?.name || feedback.category}
                </div>
              </InfoBox>

              {feedback.category === UserFeedbackCategory.Experience && feedback.rating && (
                <InfoBox>
                  <CardLabel>Avaliação</CardLabel>
                  <div className="mt-1 flex items-center gap-1 text-sm font-bold text-warning">
                    <MdStar /> {feedback.rating} / 5
                  </div>
                </InfoBox>
              )}

              <InfoBox>
                <CardLabel>Plataforma</CardLabel>
                <div className="mt-1 flex items-center gap-1 text-sm font-semibold text-white">
                  <MdPhoneIphone className="text-grays-300" />
                  {feedback.platform || "Não informada"}
                </div>
              </InfoBox>

              <InfoBox>
                <CardLabel>Versão do App</CardLabel>
                <CardValue>{feedback.appVersion ? `v${feedback.appVersion}` : "Não informada"}</CardValue>
              </InfoBox>
            </GridBox>

            {feedback.deviceInfo && (
              <div className="mt-3 rounded-lg border border-white/5 bg-white/5 p-3 text-xs text-grays-300">
                <span className="font-semibold text-grays-100">Dispositivo: </span>
                {feedback.deviceInfo}
              </div>
            )}
          </CardBox>

          <CardBox title="Relato Original de Abertura">
            <div className="flex flex-col gap-4">
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-grays-100">
                {feedback.content}
              </p>

              {feedback.images && feedback.images.length > 0 && (
                <div className="flex flex-col gap-2 border-t border-white/10 pt-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-grays-300">
                    Anexos do Relato ({feedback.images.length})
                  </span>
                  <div className="flex flex-wrap gap-2.5">
                    {feedback.images.map((img, index) => (
                      <button
                        key={img.id}
                        type="button"
                        onClick={() => handleOpenImageModal(feedback.images, index)}
                        className="h-20 w-20 overflow-hidden rounded-lg border border-white/10 hover:border-accent transition-all cursor-pointer shadow-md"
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
            </div>
          </CardBox>

          <CardBox title="Triagem & Mudança de Situação">
            <form onSubmit={hookForm.handleSubmit(onSubmitStatus)} className="flex flex-col gap-4">
              <FieldsWrapper>
                <InputGroup>
                  <Label htmlFor="status" isRequired>
                    Situação Atual
                  </Label>
                  <Select
                    hookForm={hookForm}
                    name="status"
                    initialOptions={statusEnum}
                    isLoading={isLoadingStatusEnum}
                    title="Selecione a situação"
                  />
                </InputGroup>
              </FieldsWrapper>

              <InputGroup>
                <Label htmlFor="response">
                  Resposta / Motivo (entra automaticamente na conversa)
                </Label>
                <ControlledTextarea
                  hookForm={hookForm}
                  name="response"
                  placeholder="Escreva a resposta oficial ao mudar a situação..."
                  rows={3}
                />
              </InputGroup>

              <div className="flex justify-end pt-2">
                <Button type="submit" isLoading={isUpdatingStatus}>
                  Salvar Triagem
                </Button>
              </div>
            </form>
          </CardBox>
        </div>

        <div className="flex flex-col lg:col-span-7">
          <div className="flex h-[760px] flex-col rounded-xl border border-white/10 bg-primary/40 backdrop-blur-md shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 bg-white/5 rounded-t-xl">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/20 text-accent border border-accent/30">
                  <MdForum size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Conversa com o Usuário</h3>
                  <span className="text-xs text-grays-300 font-medium">
                    {feedback.messages?.length || 0} {feedback.messages?.length === 1 ? "mensagem trocada" : "mensagens trocadas"}
                  </span>
                </div>
              </div>

              {feedback.reopensOnNewMessage && (
                <span className="rounded-full border border-warning/30 bg-warning/10 px-3 py-1 text-xs font-semibold text-warning">
                  Reabre com nova mensagem
                </span>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {(!feedback.messages || feedback.messages.length === 0) ? (
                <div className="flex h-full flex-col items-center justify-center gap-3 text-center text-grays-300 p-8">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/5 text-grays-400">
                    <MdForum size={28} />
                  </div>
                  <h4 className="text-base font-bold text-white">Nenhuma mensagem ainda</h4>
                  <p className="max-w-xs text-xs text-grays-300 leading-relaxed">
                    Utilize a caixa abaixo para tirar dúvidas, complementar informações ou responder ao usuário sem alterar o status.
                  </p>
                </div>
              ) : (
                feedback.messages.map((msg) => {
                  const isTeam = msg.isFromTeam;
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col max-w-[85%] ${
                        isTeam ? "ml-auto items-end" : "mr-auto items-start"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1.5 px-1 text-xs">
                        <span className={`font-bold ${isTeam ? "text-emerald-400" : "text-accent"}`}>
                          {msg.userName || (isTeam ? "Equipe TableForge" : "Usuário")}
                        </span>
                        <span className="text-[11px] text-grays-400">
                          {dayjs(msg.createdAt).format("DD/MM/YYYY HH:mm")}
                        </span>
                      </div>

                      <div
                        className={`rounded-2xl p-4 shadow-lg ${
                          isTeam
                            ? "rounded-tr-sm border border-emerald-500/30 bg-emerald-950/40 text-white"
                            : "rounded-tl-sm border border-grays-700 bg-grays-800 text-grays-100"
                        }`}
                      >
                        <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>

                        {msg.images && msg.images.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2 border-t border-white/10 pt-2.5">
                            {msg.images.map((img, imgIdx) => (
                              <button
                                key={img.id}
                                type="button"
                                onClick={() => handleOpenImageModal(msg.images, imgIdx)}
                                className="h-16 w-16 overflow-hidden rounded-lg border border-white/15 hover:border-accent transition-all cursor-pointer"
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
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="border-t border-white/10 bg-primary/60 p-4 rounded-b-xl flex flex-col gap-2">
              <div className="flex flex-col rounded-lg border border-grays-700 bg-grays-900 focus-within:border-accent transition-colors">
                <textarea
                  id="threadMessage"
                  value={threadMessage}
                  onChange={(e) => setThreadMessage(e.target.value)}
                  placeholder="Digite uma mensagem para o usuário nesta conversa..."
                  maxLength={2000}
                  rows={3}
                  className="w-full resize-none bg-transparent p-3 text-sm text-white placeholder-grays-400 focus:outline-none"
                />
                <div className="flex items-center justify-between border-t border-white/5 px-3 py-2 text-xs text-grays-400">
                  <span className="text-[11px]">
                    {threadMessage.length} / 2000 caracteres • Responder na conversa não move o status
                  </span>
                  <Button
                    type="button"
                    buttonStyle="secondary"
                    size="sm"
                    disabled={!threadMessage.trim() || isSendingMessage}
                    isLoading={isSendingMessage}
                    onClick={handleSendThreadMessage}
                    className="flex items-center gap-1.5"
                  >
                    <MdSend />
                    Enviar Mensagem
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
