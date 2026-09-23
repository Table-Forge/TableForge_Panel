import { Button } from "@/src/components/button/button";
import { Card } from "@/src/components/card/card";
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
import { UserStatus } from "@/src/components/user-status/user-status";
import { useUserStatusEnum } from "@/src/features/users/hooks/enums/use-user-status-enum";
import { useUserById } from "@/src/features/users/hooks/use-user-by-id";
import { useBoundStore } from "@/src/store";
import { formatDate } from "@/src/utils/format";
import { useMemo } from "react";
import { ArrowLeft } from "lucide-react";
import { MdModeEdit } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import { ModalEdit } from "./components/modal-edit/modal-edit";

export function UserDetailsPage() {
  const navigate = useNavigate();
  const openModal = useBoundStore((state) => state.openModal);
  const { id } = useParams();
  const { statusEnum } = useUserStatusEnum();

  const userId = useMemo(() => {
    const parsed = Number(id);
    return Number.isFinite(parsed) ? parsed : undefined;
  }, [id]);

  const { data, isLoading, isError } = useUserById(userId);

  if (isLoading) return <SkeletonDetails />;
  if (isError || !data) return <InfoNotFound />;

  return (
    <div className="flex flex-col gap-6">
      {/* Header Toolbar */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/users")}
            className="flex h-10 w-10 items-center justify-center chamfer-sm border border-white/10 bg-white/5 text-white/80 transition-all hover:border-white/20 hover:bg-white/10 hover:text-white"
            title="Voltar para a lista"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display text-2xl font-bold uppercase tracking-[0.04em] text-white">
                {data.nickname || data.username || "Usuário"}
              </h1>
              <span className="chamfer-sm border border-accent/40 bg-accent/15 px-2.5 py-0.5 text-xs font-bold tracking-[0.12em] text-ember">
                #{data.id}
              </span>
            </div>
            <p className="text-xs font-semibold text-grays-100">
              @{data.username || "user"} • {data.email || "Sem e-mail"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            buttonStyle="primary"
            size="sm"
            onClick={() =>
              openModal("Editar Usuário", <ModalEdit data={data} />, "md")
            }
          >
            <MdModeEdit />
            Editar Usuário
          </Button>
        </div>
      </header>

      {/* Hero Profile Bento Box */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Left: Avatar & Identity Header Card */}
        <Card padding="none" className="flex flex-col items-center justify-center p-6 text-center lg:col-span-1">
          <div className="relative mb-3 overflow-hidden rounded-full border border-white/15 shadow-xl">
            <Thumbnail
              image={data.avatarUrl}
              width={110}
              height={110}
              rounded="full"
              alt={data.nickname || data.username || "Avatar"}
              className="rounded-full object-cover"
            />
          </div>
          <h2 className="font-display text-lg font-bold tracking-[0.04em] text-white">
            {data.nickname || data.username}
          </h2>
          <span className="text-xs font-semibold text-grays-100">
            @{data.username}
          </span>
          <div className="mt-3">
            <UserStatus value={data.status} options={statusEnum} />
          </div>
        </Card>

        {/* Right: 3 Key Metric Cards */}
        <div className="grid grid-cols-1 gap-3 lg:col-span-2 sm:grid-cols-3">
          <Card padding="none" className="flex flex-col justify-between p-5">
            <span className="text-xs font-bold uppercase tracking-wider text-grays-200">
              Tipo de Perfil
            </span>
            <div className="mt-2 font-display text-xl font-bold uppercase tracking-[0.04em] text-white">
              {data.type || "Comum"}
            </div>
            <span className="mt-1 text-[10px] font-bold text-white/60">
              Nível de Acesso
            </span>
          </Card>

          <Card padding="none" className="flex flex-col justify-between p-5">
            <span className="text-xs font-bold uppercase tracking-wider text-grays-200">
              Gênero
            </span>
            <div className="mt-2 font-display text-xl font-bold capitalize tracking-[0.04em] text-white">
              {data.gender || "Não informado"}
            </div>
            <span className="mt-1 text-[10px] font-bold text-white/60">
              Identificação
            </span>
          </Card>

          <Card padding="none" className="flex flex-col justify-between p-5">
            <span className="text-xs font-bold uppercase tracking-wider text-grays-200">
              Membro Desde
            </span>
            <div className="mt-2 font-display text-base font-bold tracking-[0.04em] text-white">
              {data.createdAt ? formatDate(data.createdAt, false) : "-"}
            </div>
            <span className="mt-1 text-[10px] font-bold text-white/60">
              Data de Cadastro
            </span>
          </Card>
        </div>
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <CardBox title="Informações de Conta">
          <GridBox className="lg:grid-cols-2">
            <InfoBox>
              <CardLabel>ID de Usuário</CardLabel>
              <CardValue>{String(data.id ?? "-")}</CardValue>
            </InfoBox>
            <InfoBox>
              <CardLabel>Nome de Usuário</CardLabel>
              <CardValue>{data.username ?? "-"}</CardValue>
            </InfoBox>
            <InfoBox>
              <CardLabel>Nickname</CardLabel>
              <CardValue>{data.nickname ?? "-"}</CardValue>
            </InfoBox>
            <InfoBox>
              <CardLabel>E-mail</CardLabel>
              <CardValue className="break-all">{data.email ?? "-"}</CardValue>
            </InfoBox>
          </GridBox>
        </CardBox>

        <CardBox title="Dados Pessoais & Registro">
          <GridBox className="lg:grid-cols-2">
            <InfoBox>
              <CardLabel>Data de Nascimento</CardLabel>
              <CardValue>{data.birthDate ? formatDate(data.birthDate) : "-"}</CardValue>
            </InfoBox>
            <InfoBox>
              <CardLabel>Gênero</CardLabel>
              <CardValue>{data.gender ?? "-"}</CardValue>
            </InfoBox>
            <InfoBox>
              <CardLabel>Criado em</CardLabel>
              <CardValue>{data.createdAt ? formatDate(data.createdAt, true) : "-"}</CardValue>
            </InfoBox>
            <InfoBox>
              <CardLabel>Tipo de Usuário</CardLabel>
              <CardValue>{data.type ?? "-"}</CardValue>
            </InfoBox>
          </GridBox>
        </CardBox>
      </div>
    </div>
  );
}
