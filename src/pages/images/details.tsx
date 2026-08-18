import { Button } from "@/src/components/button/button";
import {
  CardBox,
  CardLabel,
  CardValue,
  GridBox,
  InfoBox,
} from "@/src/components/card-box/card-box";
import { InfoNotFound } from "@/src/components/page-handler/info-not-found";
import { SkeletonTable } from "@/src/components/skeleton/skeleton-table";
import { Thumbnail } from "@/src/components/thumbnail/thumbnail";
import { useImageById } from "@/src/features/images/hooks/use-image-by-id";
import { useBoundStore } from "@/src/store";
import { formatDate } from "@/src/utils/format";
import { useMemo } from "react";
import { ArrowLeft } from "lucide-react";
import { MdModeEdit } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import { CopyButton } from "@/src/components/copy-button/copy-button";
import { ModalEdit } from "./components/modal-edit/modal-edit";

export function ImageDetailsPage() {
  const navigate = useNavigate();
  const openModal = useBoundStore((state) => state.openModal);
  const { id } = useParams();

  const imageId = useMemo(() => {
    const parsed = Number(id);
    return Number.isFinite(parsed) ? parsed : undefined;
  }, [id]);

  const { data, isLoading, isError } = useImageById(imageId);

  if (isLoading) return <SkeletonTable />;
  if (isError || !data) return <InfoNotFound />;

  return (
    <div className="flex flex-col gap-6">
      {/* Header Toolbar */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/images")}
            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-primary/60 text-white/80 transition-all hover:border-white/20 hover:bg-white/10 hover:text-white"
            title="Voltar para a lista"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold uppercase tracking-tight text-white">
                {data.name || "Imagem"}
              </h1>
              <span className="rounded-full border border-white/10 bg-white/10 px-3 py-0.5 text-xs font-extrabold tracking-wide text-white/90">
                #{data.id}
              </span>
            </div>
            <p className="text-xs font-semibold text-grays-100">
              Tipo: {data.type || "Geral"} • UUID: {data.uuid || "-"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            buttonStyle="primary"
            size="sm"
            onClick={() =>
              openModal("Editar Imagem", <ModalEdit data={data} />, "md")
            }
            className="!rounded-2xl shadow-lg hover:shadow-secondary/20"
          >
            <MdModeEdit />
            Editar Imagem
          </Button>
        </div>
      </header>

      {/* Hero Media Preview Bento Card */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-primary/50 p-6 backdrop-blur-md shadow-2xl flex flex-col items-center justify-center text-center">
        <div className="relative overflow-hidden rounded-2xl border border-white/15 shadow-2xl p-2 bg-black/40 max-w-full flex items-center justify-center">
          <Thumbnail
            image={data}
            width="auto"
            height="auto"
            className="max-h-[460px] w-auto max-w-full rounded-xl object-contain"
            alt={data.name || "Imagem"}
          />
        </div>

        {data.url && (
          <div className="mt-4 flex w-full max-w-2xl items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 backdrop-blur-xs">
            <span className="truncate text-xs font-semibold text-white/80">
              {data.url}
            </span>
            <CopyButton text={data.url} />
          </div>
        )}
      </div>

      {/* Image Metadata Grid */}
      <CardBox title="Informações do Arquivo">
        <GridBox className="lg:grid-cols-3">
          <InfoBox>
            <CardLabel>ID do Recurso</CardLabel>
            <CardValue>{String(data.id ?? "-")}</CardValue>
          </InfoBox>
          <InfoBox>
            <CardLabel>Nome da Imagem</CardLabel>
            <CardValue>{data.name ?? "-"}</CardValue>
          </InfoBox>
          <InfoBox>
            <CardLabel>Tipo de Imagem</CardLabel>
            <CardValue>{data.type ?? "-"}</CardValue>
          </InfoBox>
          <InfoBox>
            <CardLabel>UUID do Arquivo</CardLabel>
            <CardValue className="break-all">{data.uuid ?? "-"}</CardValue>
          </InfoBox>
          <InfoBox>
            <CardLabel>Criado em</CardLabel>
            <CardValue>{data.createdAt ? formatDate(data.createdAt, true) : "-"}</CardValue>
          </InfoBox>
        </GridBox>
      </CardBox>
    </div>
  );
}
