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
import { useGameSystemById } from "@/src/features/game-systems/hooks/use-game-system-by-id";
import { formatDate } from "@/src/utils/format";
import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";

export function GameSystemDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const gameSystemId = useMemo(() => {
    const parsed = Number(id);
    return Number.isFinite(parsed) ? parsed : undefined;
  }, [id]);

  const { data, isLoading, isError } = useGameSystemById(gameSystemId);

  if (isLoading) return <SkeletonTable />;
  if (isError || !data) return <InfoNotFound />;

  return (
    <div className="flex flex-col gap-4">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-tight text-white">
            {data.name || "Sistema de Jogo"}
          </h1>
          <p className="text-sm text-grays-100">
            Detalhes completos do sistema de jogo.
          </p>
        </div>

        <Button
          buttonStyle="hollow"
          size="sm"
          onClick={() => navigate("/gamesystems")}
        >
          Voltar
        </Button>
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
            <CardLabel>Imagem ID</CardLabel>
            <CardValue className="mt-1 block break-all">
              {String(data.imageId ?? "-")}
            </CardValue>
          </InfoBox>
          <InfoBox>
            <CardLabel>Criado em</CardLabel>
            <CardValue className="mt-1 block break-all">
              {data.createdAt ? formatDate(data.createdAt, true) : "-"}
            </CardValue>
          </InfoBox>
          <InfoBox>
            <CardLabel>Atualizado em</CardLabel>
            <CardValue className="mt-1 block break-all">
              {data.updatedAt ? formatDate(data.updatedAt, true) : "-"}
            </CardValue>
          </InfoBox>
        </GridBox>
      </CardBox>

      <CardBox title="Descrição">
        <CardValue className="block whitespace-pre-wrap break-words font-medium">
          {data.description ?? "-"}
        </CardValue>
      </CardBox>
    </div>
  );
}
