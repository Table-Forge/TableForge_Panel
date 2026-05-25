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
import { useCampaignById } from "@/src/features/campaigns/hooks/use-campaign-by-id";
import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";

export function CampaignDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const campaignId = useMemo(() => {
    const parsed = Number(id);
    return Number.isFinite(parsed) ? parsed : undefined;
  }, [id]);

  const { data, isLoading, isError } = useCampaignById(campaignId);

  if (isLoading) return <SkeletonTable />;
  if (isError || !data) return <InfoNotFound />;

  return (
    <div className="flex flex-col gap-4">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-tight text-white">
            {data.title || "Campanha"}
          </h1>
          <p className="text-sm text-grays-100">
            Detalhes completos da campanha.
          </p>
        </div>

        <Button
          buttonStyle="hollow"
          size="sm"
          onClick={() => navigate("/campaigns")}
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
            <CardLabel>Título</CardLabel>
            <CardValue className="mt-1 block break-all">
              {data.title ?? "-"}
            </CardValue>
          </InfoBox>
          <InfoBox>
            <CardLabel>Status</CardLabel>
            <CardValue className="mt-1 block break-all">
              {data.status ?? "-"}
            </CardValue>
          </InfoBox>
          <InfoBox>
            <CardLabel>Dificuldade</CardLabel>
            <CardValue className="mt-1 block break-all">
              {data.difficulty ?? "-"}
            </CardValue>
          </InfoBox>
          <InfoBox>
            <CardLabel>Criador</CardLabel>
            <CardValue className="mt-1 block break-all">
              {data.creatorUsername ?? "-"}
            </CardValue>
          </InfoBox>
          <InfoBox>
            <CardLabel>Limite de jogadores</CardLabel>
            <CardValue className="mt-1 block break-all">
              {String(data.playersLimit ?? 0)}
            </CardValue>
          </InfoBox>
          <InfoBox>
            <CardLabel>Campanha privada</CardLabel>
            <CardValue className="mt-1 block break-all">
              {data.isPrivate ? "Sim" : "Não"}
            </CardValue>
          </InfoBox>
          <InfoBox>
            <CardLabel>Chat habilitado</CardLabel>
            <CardValue className="mt-1 block break-all">
              {data.isChatEnabled ? "Sim" : "Não"}
            </CardValue>
          </InfoBox>
        </GridBox>
      </CardBox>

      <CardBox title="Vínculos">
        <GridBox>
          <InfoBox>
            <CardLabel>ID do criador</CardLabel>
            <CardValue className="mt-1 block break-all">
              {String(data.creatorId ?? "-")}
            </CardValue>
          </InfoBox>
          <InfoBox>
            <CardLabel>Localização</CardLabel>
            <CardValue className="mt-1 block break-all">
              {data.locationName ?? "-"}
            </CardValue>
          </InfoBox>
          <InfoBox>
            <CardLabel>Endereço</CardLabel>
            <CardValue className="mt-1 block break-all">
              {data.address ?? "-"}
            </CardValue>
          </InfoBox>
          <InfoBox>
            <CardLabel>Sistema de jogo</CardLabel>
            <CardValue className="mt-1 block break-all">
              {data.gameSystemName ?? String(data.gameSystemId ?? "-")}
            </CardValue>
          </InfoBox>
        </GridBox>
      </CardBox>

      <CardBox title="Descrição">
        <CardValue className="block whitespace-pre-wrap break-words font-medium">
          {data.description ?? "-"}
        </CardValue>
      </CardBox>

      <CardBox title="Banner">
        {data.bannerUrl ? (
          <Thumbnail
            image={data.bannerUrl}
            width={240}
            height={150}
            alt={data.title || "Banner"}
          />
        ) : (
          <CardValue className="mt-1 block break-all">
            {String(data.bannerId ?? "-")}
          </CardValue>
        )}
      </CardBox>
    </div>
  );
}
