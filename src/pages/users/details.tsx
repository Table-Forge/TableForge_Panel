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
import { UserStatus } from "@/src/components/user-status/user-status";
import { useUserStatusEnum } from "@/src/features/users/hooks/enums/use-user-status-enum";
import { useUserById } from "@/src/features/users/hooks/use-user-by-id";
import { formatDate } from "@/src/utils/format";
import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";

export function UserDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { statusEnum } = useUserStatusEnum();

  const userId = useMemo(() => {
    const parsed = Number(id);
    return Number.isFinite(parsed) ? parsed : undefined;
  }, [id]);

  const { data, isLoading, isError } = useUserById(userId);

  if (isLoading) return <SkeletonTable />;
  if (isError || !data) return <InfoNotFound />;

  return (
    <div className="flex flex-col gap-4">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-tight text-white">
            {data.nickname || data.username || "Usuário"}
          </h1>
          <p className="text-sm text-grays-100">
            Detalhes completos do usuário.
          </p>
        </div>

        <Button buttonStyle="hollow" size="sm" onClick={() => navigate("/users")}>
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
            <CardLabel>Usuário</CardLabel>
            <CardValue className="mt-1 block break-all">
              {data.username ?? "-"}
            </CardValue>
          </InfoBox>
          <InfoBox>
            <CardLabel>Nickname</CardLabel>
            <CardValue className="mt-1 block break-all">
              {data.nickname ?? "-"}
            </CardValue>
          </InfoBox>
          <InfoBox>
            <CardLabel>E-mail</CardLabel>
            <CardValue className="mt-1 block break-all">
              {data.email ?? "-"}
            </CardValue>
          </InfoBox>
          <InfoBox>
            <CardLabel>Tipo de perfil</CardLabel>
            <CardValue className="mt-1 block break-all">
              {data.type ?? "-"}
            </CardValue>
          </InfoBox>
          <InfoBox>
            <CardLabel>Status</CardLabel>
            <div className="mt-1">
              <UserStatus value={data.status} options={statusEnum} />
            </div>
          </InfoBox>
        </GridBox>
      </CardBox>

      <CardBox title="Dados Pessoais">
        <GridBox>
          <InfoBox>
            <CardLabel>Gênero</CardLabel>
            <CardValue className="mt-1 block break-all">
              {data.gender ?? "-"}
            </CardValue>
          </InfoBox>
          <InfoBox>
            <CardLabel>Data de nascimento</CardLabel>
            <CardValue className="mt-1 block break-all">
              {data.birthDate ? formatDate(data.birthDate) : "-"}
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

      <CardBox title="Avatar">
        <Thumbnail
          image={data.avatarUrl}
          width={200}
          height={200}
          alt={data.nickname || data.username || "Avatar"}
        />
      </CardBox>
    </div>
  );
}
