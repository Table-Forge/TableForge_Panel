import { InfoNotFound } from "@/src/components/page-handler/info-not-found";
import { SkeletonDetails } from "@/src/components/skeleton/skeleton-details";
import { useAuth } from "@/src/context/use-auth";
import { useAllSpaces } from "@/src/features/spaces/hooks/use-spaces-queries";
import { useMemo } from "react";
import { Button } from "@/src/components/button/button";
import { MdModeEdit } from "react-icons/md";
import { useBoundStore } from "@/src/store";
import { ModalEditSpace } from "./components/modal-edit-space/modal-edit-space";
import { CardBox, CardLabel, CardValue, GridBox, InfoBox } from "@/src/components/card-box/card-box";
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

  if (allSpacesQuery.isError || !space) {
    return (
      <div className="flex flex-col items-center justify-center pt-20">
        <InfoNotFound message="Você ainda não possui um espaço cadastrado." />
        <Button
          buttonStyle="primary"
          className="mt-4"
          onClick={() => openModal("Criar Espaço", <ModalEditSpace />, "md")}
        >
          Criar Meu Espaço
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
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
            Gerencie as informações do seu espaço e mesas.
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

      <CardBox title="Informações Gerais">
        <GridBox>
          <InfoBox>
            <CardLabel>Nome</CardLabel>
            <CardValue className="mt-1 block break-all">
              {space.name ?? "-"}
            </CardValue>
          </InfoBox>
          <InfoBox>
            <CardLabel>Telefone</CardLabel>
            <CardValue className="mt-1 block break-all">
              {space.phoneNumber ?? "-"}
            </CardValue>
          </InfoBox>
          <InfoBox>
            <CardLabel>Status</CardLabel>
            <div className="mt-1">
              <SpaceStatus value={space.status} />
            </div>
          </InfoBox>
          <InfoBox className="col-span-1 md:col-span-2 lg:col-span-3">
            <CardLabel>Descrição</CardLabel>
            <CardValue className="mt-1 block break-all">
              {space.description ?? "-"}
            </CardValue>
          </InfoBox>
        </GridBox>
      </CardBox>

      <CardBox title="Endereço">
        <GridBox>
          <InfoBox className="col-span-1 md:col-span-2">
            <CardLabel>Localização</CardLabel>
            <CardValue className="mt-1 block break-all">
              {space.address ?? "-"}
            </CardValue>
          </InfoBox>
          <InfoBox>
            <CardLabel>Latitude / Longitude</CardLabel>
            <CardValue className="mt-1 block break-all">
              {space.latitude}, {space.longitude}
            </CardValue>
          </InfoBox>
        </GridBox>
      </CardBox>

      <CardBox title="Horário de Funcionamento">
        <GridBox>
          <InfoBox>
            <CardLabel>Dias Abertos</CardLabel>
            <CardValue className="mt-1 block break-all">
              {space.workingDays ?? "-"}
            </CardValue>
          </InfoBox>
          <InfoBox>
            <CardLabel>Abertura</CardLabel>
            <CardValue className="mt-1 block break-all">
              {space.openTime ?? "-"}
            </CardValue>
          </InfoBox>
          <InfoBox>
            <CardLabel>Fechamento</CardLabel>
            <CardValue className="mt-1 block break-all">
              {space.closeTime ?? "-"}
            </CardValue>
          </InfoBox>
        </GridBox>
      </CardBox>

      {space.bannerUrl && (
        <CardBox title="Banner">
          <Thumbnail
            image={space.bannerUrl}
            width={400}
            height={200}
            alt="Banner do Espaço"
            className="object-cover"
          />
        </CardBox>
      )}

      {/* Mesas Section */}
      <TablesTab spaceId={space.id} />
    </div>
  );
}
