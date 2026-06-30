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
import { MdModeEdit } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
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
    <div className="flex flex-col gap-4">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-tight text-white">
            {data.name || "Imagem"}
          </h1>
          <p className="text-sm text-grays-100">
            Detalhes completos da imagem.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            buttonStyle="primary"
            size="sm"
            onClick={() =>
              openModal("Editar Imagem", <ModalEdit data={data} />, "md")
            }
          >
            <MdModeEdit />
            Editar
          </Button>
          <Button
            buttonStyle="hollow"
            size="sm"
            onClick={() => navigate("/images")}
          >
            Voltar
          </Button>
        </div>
      </header>

      <CardBox title="Informações Gerais">
        <GridBox>
          <InfoBox>
            <CardLabel>ID</CardLabel>
            <CardValue className="mt-1 block break-all">
              {String(data.id ?? "-")}
            </CardValue>
          </InfoBox>
          <InfoBox>
            <CardLabel>Nome</CardLabel>
            <CardValue className="mt-1 block break-all">
              {data.name ?? "-"}
            </CardValue>
          </InfoBox>
          <InfoBox>
            <CardLabel>UUID</CardLabel>
            <CardValue className="mt-1 block break-all">
              {data.uuid ?? "-"}
            </CardValue>
          </InfoBox>
          <InfoBox>
            <CardLabel>Tipo</CardLabel>
            <CardValue className="mt-1 block break-all">
              {data.type ?? "-"}
            </CardValue>
          </InfoBox>
          <InfoBox>
            <CardLabel>Criado em</CardLabel>
            <CardValue className="mt-1 block break-all">
              {data.createdAt ? formatDate(data.createdAt, true) : "-"}
            </CardValue>
          </InfoBox>
        </GridBox>
      </CardBox>

      <CardBox title="Visualização e Link">
        <div className="flex flex-col gap-6">
          <div>
            <CardLabel>URL do recurso</CardLabel>
            <CardValue className="mt-1 block break-all font-semibold text-primary">
              <a href={data.url} target="_blank" rel="noreferrer">
                {data.url ?? "-"}
              </a>
            </CardValue>
          </div>
          <div>
            <CardLabel>Prévia</CardLabel>
            <div className="mt-1">
              <Thumbnail
                image={data}
                width="auto"
                height="auto"
                className="max-h-[500px] w-fit rounded-lg"
                alt={data.name || "Imagem"}
              />
            </div>
          </div>
        </div>
      </CardBox>
    </div>
  );
}
