import { Button } from "@/src/components/button/button";
import {
  CardBox,
  CardLabel,
  CardValue,
  GridBox,
  InfoBox,
} from "@/src/components/card-box/card-box";
import { InfoNotFound } from "@/src/components/page-handler/info-not-found";
import { SkeletonDetails } from "@/src/components/skeleton/skeleton-details";
import { Thumbnail } from "@/src/components/thumbnail/thumbnail";
import { useCampaignStatusEnum } from "@/src/features/campaigns/hooks/enums/use-campaign-status-enum";
import { useCampaignDifficultyLevelEnum } from "@/src/features/campaigns/hooks/enums/use-campaign-difficulty-level-enum";
import { useCampaignFrequencyEnum } from "@/src/features/campaigns/hooks/enums/use-campaign-frequency-enum";
import { useCampaignById } from "@/src/features/campaigns/hooks/use-campaign-by-id";
import { useBoundStore } from "@/src/store";
import { useMemo } from "react";
import { ArrowLeft } from "lucide-react";
import { MdModeEdit } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import { ModalEdit } from "./components/modal-edit/modal-edit";

export function CampaignDetailsPage() {
  const navigate = useNavigate();
  const openModal = useBoundStore((state) => state.openModal);
  const { id } = useParams();

  const campaignId = useMemo(() => {
    const parsed = Number(id);
    return Number.isFinite(parsed) ? parsed : undefined;
  }, [id]);

  const { campaignStatusEnum } = useCampaignStatusEnum();
  const { difficultyLevelEnum } = useCampaignDifficultyLevelEnum();
  const { frequencyEnum } = useCampaignFrequencyEnum();

  const { data, isLoading, isError } = useCampaignById(campaignId);

  if (isLoading) return <SkeletonDetails />;
  if (isError || !data) return <InfoNotFound />;

  const statusName = data.status
    ? campaignStatusEnum.find((o) => o.value === data.status)?.name || data.status
    : "-";

  const difficultyName = data.difficulty
    ? difficultyLevelEnum.find((o) => o.value === data.difficulty)?.name || data.difficulty
    : "-";

  const frequencyName = data.frequency
    ? frequencyEnum.find((o) => o.value === data.frequency)?.name || data.frequency
    : "-";

  return (
    <div className="flex flex-col gap-6">
      {/* Navigation & Header */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/campaigns")}
            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-primary/60 text-white/80 transition-all hover:border-white/20 hover:bg-white/10 hover:text-white"
            title="Voltar para a lista"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold uppercase tracking-tight text-white">
                {data.title || "Campanha"}
              </h1>
              <span className="rounded-full border border-white/10 bg-white/10 px-3 py-0.5 text-xs font-extrabold tracking-wide text-white/90">
                #{data.id}
              </span>
            </div>
            <p className="text-xs font-semibold text-grays-100">
              Sistema: {data.gameSystemName || "RPG"} • Criado por {data.creatorUsername || "Mestre"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            buttonStyle="primary"
            size="sm"
            onClick={() =>
              openModal("Editar Campanha", <ModalEdit data={data} />, "md")
            }
            className="!rounded-2xl shadow-lg hover:shadow-secondary/20"
          >
            <MdModeEdit />
            Editar Campanha
          </Button>
        </div>
      </header>

      {/* Hero Bento Box & KPI Cards Row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Left: Media Banner / Identity */}
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-primary/50 p-6 backdrop-blur-md shadow-2xl flex flex-col justify-between lg:col-span-1">
          {data.bannerUrl ? (
            <div className="relative overflow-hidden rounded-2xl border border-white/10 shadow-lg">
              <Thumbnail
                image={data.bannerUrl}
                width="100%"
                height={160}
                alt={data.title || "Banner"}
                className="w-full object-cover"
              />
            </div>
          ) : (
            <div className="flex h-36 w-full items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-xs font-bold uppercase tracking-wider text-white/40">
              Sem Imagem
            </div>
          )}

          <div className="mt-4 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-grays-200">
              Status Atual
            </span>
            <span className="rounded-full border border-emerald-500/30 bg-emerald-500/20 px-3 py-1 text-xs font-extrabold text-emerald-300 shadow-xs">
              {statusName}
            </span>
          </div>
        </div>

        {/* Right: 4 Quick Stat KPIs */}
        <div className="grid grid-cols-2 gap-3 lg:col-span-2 sm:grid-cols-4">
          <div className="flex flex-col justify-between rounded-3xl border border-white/10 bg-primary/40 p-5 backdrop-blur-md shadow-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-grays-200">
              Jogadores
            </span>
            <div className="mt-2 text-2xl font-extrabold text-white">
              {data.membersCount ?? 0} / {data.playersLimit ?? 0}
            </div>
            <span className="mt-1 text-[10px] font-bold text-white/60">
              Limite Configurado
            </span>
          </div>

          <div className="flex flex-col justify-between rounded-3xl border border-white/10 bg-primary/40 p-5 backdrop-blur-md shadow-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-grays-200">
              Dificuldade
            </span>
            <div className="mt-2 text-xl font-extrabold text-white truncate">
              {difficultyName}
            </div>
            <span className="mt-1 text-[10px] font-bold text-white/60">
              Nível do Desafio
            </span>
          </div>

          <div className="flex flex-col justify-between rounded-3xl border border-white/10 bg-primary/40 p-5 backdrop-blur-md shadow-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-grays-200">
              Frequência
            </span>
            <div className="mt-2 text-xl font-extrabold text-white truncate">
              {frequencyName}
            </div>
            <span className="mt-1 text-[10px] font-bold text-white/60">
              Periodicidade
            </span>
          </div>

          <div className="flex flex-col justify-between rounded-3xl border border-white/10 bg-primary/40 p-5 backdrop-blur-md shadow-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-grays-200">
              Privacidade
            </span>
            <div className="mt-2 text-xl font-extrabold text-white">
              {data.isPrivate ? "Privada" : "Pública"}
            </div>
            <span className="mt-1 text-[10px] font-bold text-white/60">
              Visibilidade
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Details Grid */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <CardBox title="Informações Gerais">
          <GridBox className="lg:grid-cols-2">
            <InfoBox>
              <CardLabel>ID da Campanha</CardLabel>
              <CardValue>{String(data.id ?? "-")}</CardValue>
            </InfoBox>
            <InfoBox>
              <CardLabel>Mestre / Criador</CardLabel>
              <CardValue>{data.creatorUsername ?? "-"}</CardValue>
            </InfoBox>
            <InfoBox>
              <CardLabel>Sistema de Jogo</CardLabel>
              <CardValue>{data.gameSystemName ?? String(data.gameSystemId ?? "-")}</CardValue>
            </InfoBox>
            <InfoBox>
              <CardLabel>Chat Habilitado</CardLabel>
              <CardValue>{data.isChatEnabled ? "Sim" : "Não"}</CardValue>
            </InfoBox>
          </GridBox>
        </CardBox>

        <CardBox title="Localização e Vínculos">
          <GridBox className="lg:grid-cols-2">
            <InfoBox>
              <CardLabel>Localização</CardLabel>
              <CardValue>{data.locationName ?? "-"}</CardValue>
            </InfoBox>
            <InfoBox>
              <CardLabel>Endereço</CardLabel>
              <CardValue>{data.address ?? "-"}</CardValue>
            </InfoBox>
            <InfoBox>
              <CardLabel>ID do Criador</CardLabel>
              <CardValue>{String(data.creatorId ?? "-")}</CardValue>
            </InfoBox>
            <InfoBox>
              <CardLabel>ID do Banner</CardLabel>
              <CardValue>{String(data.bannerId ?? "-")}</CardValue>
            </InfoBox>
          </GridBox>
        </CardBox>
      </div>

      {/* Description Section */}
      <CardBox title="Descrição da Campanha">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm font-medium leading-relaxed text-white/90">
          {data.description || "Nenhuma descrição fornecida para esta campanha."}
        </div>
      </CardBox>
    </div>
  );
}
