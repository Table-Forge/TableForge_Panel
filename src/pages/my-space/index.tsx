import { InfoNotFound } from "@/src/components/page-handler/info-not-found";
import { SkeletonDetails } from "@/src/components/skeleton/skeleton-details";
import { useAuth } from "@/src/context/use-auth";
import { useAllSpaces } from "@/src/features/spaces/hooks/use-spaces-queries";
import { useMemo } from "react";
import { Button } from "@/src/components/button/button";
import { MdAdd, MdModeEdit } from "react-icons/md";
import { Store, Phone, Clock, CalendarDays } from "lucide-react";
import { useBoundStore } from "@/src/store";
import { ModalEditSpace } from "./components/modal-edit-space/modal-edit-space";
import {
  CardBox,
  CardLabel,
  CardValue,
  GridBox,
  InfoBox,
} from "@/src/components/card-box/card-box";
import { SpaceStatus } from "@/src/features/spaces/components/space-status";
import { Thumbnail } from "@/src/components/thumbnail/thumbnail";
import { TablesTab } from "./components/tables-tab/tables-tab";

export function MySpacePage() {
  const { user } = useAuth();
  const openModal = useBoundStore((state) => state.openModal);

  const isOrganizer = user?.type === "Organizer";
  const { spaces, isLoadingSpaces: isLoading, allSpacesQuery } = useAllSpaces(
    isOrganizer ? { ownerId: user?.id } : {},
    !!user?.id
  );

  const space = useMemo(() => {
    return spaces?.[0] ?? null;
  }, [spaces]);

  if (isLoading) return <SkeletonDetails />;

  if (allSpacesQuery.isError) {
    return (
      <InfoNotFound message="Ocorreu um erro ao carregar as informações do espaço." />
    );
  }

  if (!space) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 rounded-3xl border border-white/10 bg-primary/40 p-8 text-center backdrop-blur-md">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-secondary">
          <Store size={32} />
        </div>
        <h2 className="text-xl font-extrabold uppercase text-white">
          Nenhum Espaço Cadastrado
        </h2>
        <p className="max-w-md text-xs font-semibold text-grays-100 leading-relaxed">
          Você ainda não possui um espaço físico cadastrado no sistema. Crie o seu espaço para gerenciar mesas, horários e agendamentos dos seus clientes.
        </p>
        <Button
          buttonStyle="primary"
          size="md"
          onClick={() => openModal("Criar Espaço", <ModalEditSpace />, "md")}
          className="mt-2 !rounded-2xl shadow-lg hover:shadow-secondary/20"
        >
          <MdAdd />
          Cadastrar Meu Espaço
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold uppercase tracking-tight text-white">
              {space.name}
            </h1>
            <span className="rounded-full border border-white/10 bg-white/10 px-3 py-0.5 text-xs font-extrabold tracking-wide text-white/90">
              #{space.id}
            </span>
          </div>
          <p className="text-xs font-semibold text-grays-100 mt-1">
            Gerencie as informações do seu espaço e mesas físicas.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            buttonStyle="primary"
            size="sm"
            onClick={() =>
              openModal("Editar Espaço", <ModalEditSpace data={space} />, "md")
            }
            className="!rounded-2xl shadow-lg hover:shadow-secondary/20"
          >
            <MdModeEdit />
            Editar Espaço
          </Button>
        </div>
      </header>

      {/* Hero Bento Box & KPI Cards Row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Left: Media / Identity Card */}
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-primary/50 p-6 backdrop-blur-md shadow-2xl flex flex-col justify-between lg:col-span-1">
          {space.bannerUrl ? (
            <div className="relative overflow-hidden rounded-2xl border border-white/10 shadow-lg">
              <Thumbnail
                image={space.bannerUrl}
                width="100%"
                height={140}
                alt={space.name || "Banner"}
                className="w-full object-cover"
              />
            </div>
          ) : (
            <div className="flex h-36 w-full flex-col items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 text-xs font-bold uppercase tracking-wider text-white/40">
              <Store size={28} />
              Sem Banner
            </div>
          )}

          <div className="mt-4 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-grays-200">
              Status do Espaço
            </span>
            <SpaceStatus value={space.status} />
          </div>
        </div>

        {/* Right: 4 Quick Stat KPIs */}
        <div className="grid grid-cols-2 gap-3 lg:col-span-2 sm:grid-cols-4">
          <div className="flex flex-col justify-between rounded-3xl border border-white/10 bg-primary/40 p-5 backdrop-blur-md shadow-xl">
            <div className="flex items-center gap-2 text-grays-200">
              <Phone size={16} className="text-secondary" />
              <span className="text-[10px] font-extrabold uppercase tracking-widest">
                Telefone
              </span>
            </div>
            <div className="mt-2 text-sm font-extrabold text-white truncate">
              {space.phoneNumber ?? "-"}
            </div>
            <span className="mt-1 text-[10px] font-bold text-white/60">
              Contato Comercial
            </span>
          </div>

          <div className="flex flex-col justify-between rounded-3xl border border-white/10 bg-primary/40 p-5 backdrop-blur-md shadow-xl">
            <div className="flex items-center gap-2 text-grays-200">
              <Clock size={16} className="text-amber-400" />
              <span className="text-[10px] font-extrabold uppercase tracking-widest">
                Horários
              </span>
            </div>
            <div className="mt-2 text-xs font-extrabold text-white truncate">
              {space.openTime && space.closeTime
                ? `${space.openTime} às ${space.closeTime}`
                : space.openTime || "-"}
            </div>
            <span className="mt-1 text-[10px] font-bold text-white/60">
              Abertura & Fechamento
            </span>
          </div>

          <div className="flex flex-col justify-between rounded-3xl border border-white/10 bg-primary/40 p-5 backdrop-blur-md shadow-xl">
            <div className="flex items-center gap-2 text-grays-200">
              <CalendarDays size={16} className="text-purple-400" />
              <span className="text-[10px] font-extrabold uppercase tracking-widest">
                Funcionamento
              </span>
            </div>
            <div className="mt-2 text-xs font-extrabold text-white truncate">
              {space.workingDays ?? "-"}
            </div>
            <span className="mt-1 text-[10px] font-bold text-white/60">
              Dias Abertos
            </span>
          </div>

          <div className="flex flex-col justify-between rounded-3xl border border-white/10 bg-primary/40 p-5 backdrop-blur-md shadow-xl">
            <div className="flex items-center gap-2 text-grays-200">
              <Store size={16} className="text-emerald-400" />
              <span className="text-[10px] font-extrabold uppercase tracking-widest">
                Identificador
              </span>
            </div>
            <div className="mt-2 text-lg font-extrabold text-white truncate">
              #{space.id}
            </div>
            <span className="mt-1 text-[10px] font-bold text-white/60">
              ID do Espaço
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Details Grid */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <CardBox title="Informações Gerais">
          <GridBox className="lg:grid-cols-2">
            <InfoBox>
              <CardLabel>Nome do Espaço</CardLabel>
              <CardValue>{space.name ?? "-"}</CardValue>
            </InfoBox>
            <InfoBox>
              <CardLabel>Telefone</CardLabel>
              <CardValue>{space.phoneNumber ?? "-"}</CardValue>
            </InfoBox>
            <InfoBox>
              <CardLabel>Status</CardLabel>
              <div className="mt-1">
                <SpaceStatus value={space.status} />
              </div>
            </InfoBox>
            <InfoBox>
              <CardLabel>ID do Proprietário</CardLabel>
              <CardValue>{String(space.ownerId ?? "-")}</CardValue>
            </InfoBox>
          </GridBox>
          {space.description && (
            <div className="mt-4 border-t border-white/10 pt-4">
              <CardLabel className="mb-1">Descrição</CardLabel>
              <p className="text-xs font-medium text-white/90 leading-relaxed whitespace-pre-wrap">
                {space.description}
              </p>
            </div>
          )}
        </CardBox>

        <CardBox title="Localização e Endereço">
          <GridBox className="lg:grid-cols-2">
            <InfoBox className="lg:col-span-2">
              <CardLabel>Endereço Completo</CardLabel>
              <CardValue>{space.address ?? "-"}</CardValue>
            </InfoBox>
            <InfoBox>
              <CardLabel>Latitude</CardLabel>
              <CardValue>{space.latitude ?? "-"}</CardValue>
            </InfoBox>
            <InfoBox>
              <CardLabel>Longitude</CardLabel>
              <CardValue>{space.longitude ?? "-"}</CardValue>
            </InfoBox>
          </GridBox>
        </CardBox>
      </div>

      {/* Mesas Section */}
      <TablesTab spaceId={space.id} />
    </div>
  );
}
