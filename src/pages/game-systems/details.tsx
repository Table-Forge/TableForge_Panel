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
import { useGameSystemById } from "@/src/features/game-systems/hooks/use-game-system-by-id";
import { useBoundStore } from "@/src/store";
import { formatDate } from "@/src/utils/format";
import { useMemo } from "react";
import { ArrowLeft } from "lucide-react";
import { MdModeEdit } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import { ModalEdit } from "./components/modal-edit/modal-edit";

export function GameSystemDetailsPage() {
  const navigate = useNavigate();
  const openModal = useBoundStore((state) => state.openModal);
  const { id } = useParams();

  const gameSystemId = useMemo(() => {
    const parsed = Number(id);
    return Number.isFinite(parsed) ? parsed : undefined;
  }, [id]);

  const { data, isLoading, isError } = useGameSystemById(gameSystemId);

  if (isLoading) return <SkeletonDetails />;
  if (isError || !data) return <InfoNotFound />;

  return (
    <div className="flex flex-col gap-6">
      {/* Header Toolbar */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/gamesystems")}
            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-primary/60 text-white/80 transition-all hover:border-white/20 hover:bg-white/10 hover:text-white"
            title="Voltar para a lista"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold uppercase tracking-tight text-white">
                {data.name || "Sistema de Jogo"}
              </h1>
              <span className="rounded-full border border-white/10 bg-white/10 px-3 py-0.5 text-xs font-extrabold tracking-wide text-white/90">
                #{data.id}
              </span>
            </div>
            <p className="text-xs font-semibold text-grays-100">
              Sistema RPG cadastrado no TableForge
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            buttonStyle="primary"
            size="sm"
            onClick={() =>
              openModal(
                "Editar Sistema de Jogo",
                <ModalEdit data={data} />,
                "md",
              )
            }
            className="!rounded-2xl shadow-lg hover:shadow-secondary/20"
          >
            <MdModeEdit />
            Editar Sistema
          </Button>
        </div>
      </header>

      {/* Hero Bento Box */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Image Preview Card */}
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-primary/50 p-6 backdrop-blur-md shadow-2xl flex flex-col items-center justify-center text-center lg:col-span-1">
          {data.imageUrl ? (
            <div className="relative overflow-hidden rounded-2xl border border-white/15 shadow-xl">
              <Thumbnail
                image={data.imageUrl}
                width={140}
                height={140}
                alt={data.name || "Imagem"}
                className="rounded-2xl object-cover"
              />
            </div>
          ) : (
            <div className="flex h-36 w-full items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-xs font-bold uppercase tracking-wider text-white/40">
              Sem Imagem
            </div>
          )}
          <h2 className="mt-3 text-lg font-extrabold text-white">
            {data.name}
          </h2>
        </div>

        {/* Right Stats */}
        <div className="grid grid-cols-1 gap-3 lg:col-span-2 sm:grid-cols-2">
          <div className="flex flex-col justify-between rounded-3xl border border-white/10 bg-primary/40 p-5 backdrop-blur-md shadow-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-grays-200">
              Criado em
            </span>
            <div className="mt-2 text-lg font-extrabold text-white">
              {data.createdAt ? formatDate(data.createdAt, true) : "-"}
            </div>
            <span className="mt-1 text-[10px] font-bold text-white/60">
              Data de Registro
            </span>
          </div>

          <div className="flex flex-col justify-between rounded-3xl border border-white/10 bg-primary/40 p-5 backdrop-blur-md shadow-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-grays-200">
              Última Atualização
            </span>
            <div className="mt-2 text-lg font-extrabold text-white">
              {data.updatedAt ? formatDate(data.updatedAt, true) : "-"}
            </div>
            <span className="mt-1 text-[10px] font-bold text-white/60">
              Modificado em
            </span>
          </div>
        </div>
      </div>

      {/* General Info */}
      <CardBox title="Informações Gerais">
        <GridBox className="lg:grid-cols-2">
          <InfoBox>
            <CardLabel>ID do Sistema</CardLabel>
            <CardValue>{String(data.id ?? "-")}</CardValue>
          </InfoBox>
          <InfoBox>
            <CardLabel>Nome do Sistema</CardLabel>
            <CardValue>{data.name ?? "-"}</CardValue>
          </InfoBox>
        </GridBox>
      </CardBox>

      {/* Description */}
      <CardBox title="Descrição do Sistema">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm font-medium leading-relaxed text-white/90">
          {data.description || "Nenhuma descrição fornecida para este sistema."}
        </div>
      </CardBox>
    </div>
  );
}
