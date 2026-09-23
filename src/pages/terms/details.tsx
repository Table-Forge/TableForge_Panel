import { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  AlertOctagon,
  Edit,
  Trash2,
  FileText,
  ExternalLink,
  MapPin,
  CopyPlus,
} from "lucide-react";

import { useBoundStore } from "@/src/store";
import { Button } from "@/src/components/button/button";
import { CardBox, GridBox, InfoBox, CardLabel, CardValue } from "@/src/components/card-box/card-box";
import { InfoNotFound } from "@/src/components/page-handler/info-not-found";
import { SkeletonDetails } from "@/src/components/skeleton/skeleton-details";
import { Table } from "@/src/components/table/table";
import { Paginate } from "@/src/components/paginate/paginate";
import { ModalDelete } from "@/src/components/modals/modal-delete/modal-delete";
import { formatDate } from "@/src/utils/format";
import { useTermsById, useTermsAcceptances } from "@/src/features/terms/hooks/use-terms-queries";
import { useTermsMutations } from "@/src/features/terms/hooks/use-terms-mutations";
import { useTermsStatusEnum } from "@/src/features/terms/hooks/enums/use-terms-enums";
import { type ITermsAcceptanceList } from "@/src/features/terms/schemas/terms.schema";
import { type ITableColumn } from "@/src/components/table/table.interfaces";
import { TermsStatusBadge } from "./components/terms-status-badge/terms-status-badge";
import { ModalEdit } from "./components/modal-edit/modal-edit";
import { ModalActionConfirm } from "./components/modal-action-confirm/modal-action-confirm";

export function TermsDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const openModal = useBoundStore((state) => state.openModal);
  const closeModal = useBoundStore((state) => state.closeModal);

  const [acceptancesPage, setAcceptancesPage] = useState(1);

  const termId = useMemo(() => {
    const parsed = Number(id);
    return Number.isFinite(parsed) ? parsed : undefined;
  }, [id]);

  const { data, isLoading, isError } = useTermsById(termId);
  const { data: acceptancesData, isLoading: isLoadingAcceptances } =
    useTermsAcceptances(termId, acceptancesPage, 10);
  const { data: statusEnum } = useTermsStatusEnum(false);

  const { approveMutation, deprecateMutation, deleteMutation } =
    useTermsMutations();

  const handleApprove = () => {
    if (!data) return;
    openModal(
      "Aprovar e Ativar Contrato",
      <ModalActionConfirm
        description={`Ao ativar a v${data.version}, a versão anterior passa a Depreciada e a v${data.version} começa a ser exigida de todo novo cadastro. Esta ação não pode ser desfeita.`}
        confirmLabel="Aprovar e Ativar"
        buttonStyle="secondary"
        onConfirm={async () => {
          await approveMutation.mutateAsync(data.id);
          closeModal();
        }}
      />,
      "md",
    );
  };

  const handleDeprecate = () => {
    if (!data) return;
    openModal(
      "Depreciar Contrato",
      <ModalActionConfirm
        description="O público ficará sem contrato vigente até que uma nova versão seja aprovada, e o aceite deixará de ser exigido no cadastro."
        confirmLabel="Depreciar Contrato"
        buttonStyle="danger"
        onConfirm={async () => {
          await deprecateMutation.mutateAsync(data.id);
          closeModal();
        }}
      />,
      "md",
    );
  };

  const handleDelete = () => {
    if (!data) return;
    openModal(
      "Excluir Rascunho",
      <ModalDelete
        id={data.id}
        name={`Contrato v${data.version} - ${data.title}`}
        deleteMutation={deleteMutation}
        customMessage={`Tem certeza que deseja excluir o rascunho da v${data.version}? Esta versão ainda não vigorou e será descartada.`}
      />,
      "sm",
    );
  };

  const acceptanceColumns: ITableColumn<ITermsAcceptanceList>[] = [
    {
      title: "ID",
      key: "id",
      width: "70px",
      align: "center",
      render: (item) => <span className="font-extrabold text-white">#{item.id}</span>,
    },
    {
      title: "Usuário",
      key: "userName",
      width: "180px",
      render: (item) => (
        <div className="flex flex-col">
          <span className="font-bold text-white">{item.userName}</span>
          <span className="text-[11px] text-grays-200">ID: #{item.userId}</span>
        </div>
      ),
    },
    {
      title: "E-mail",
      key: "userEmail",
      width: "220px",
      normalCase: true,
      render: (item) => item.userEmail,
    },
    {
      title: "Data e Hora",
      key: "acceptedAt",
      width: "180px",
      align: "center",
      render: (item) => formatDate(item.acceptedAt, true),
    },
    {
      title: "Versão",
      key: "version",
      width: "80px",
      align: "center",
      render: (item) => (
        <span className="shrink-0 whitespace-nowrap chamfer-sm border border-white/10 bg-white/5 px-2 py-0.5 text-xs font-bold text-secondary">
          v{item.version}
        </span>
      ),
    },
    {
      title: "Endereço IP",
      key: "ipAddress",
      width: "140px",
      align: "center",
      render: (item) => <span className="font-mono text-xs">{item.ipAddress}</span>,
    },
    {
      title: "Localização",
      key: "location",
      width: "140px",
      align: "center",
      render: (item) =>
        item.latitude && item.longitude ? (
          <a
            href={`https://www.google.com/maps?q=${item.latitude},${item.longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 chamfer-sm border border-secondary/30 bg-secondary/10 px-2.5 py-1 text-xs font-bold text-secondary hover:bg-secondary/20 transition-all"
            title="Ver no mapa"
          >
            <MapPin size={13} />
            Mapa
          </a>
        ) : (
          <span className="text-grays-300 text-xs">-</span>
        ),
    },
  ];

  if (isLoading) return <SkeletonDetails />;
  if (isError || !data) {
    return (
      <InfoNotFound message="Contrato de termos e condições não encontrado." />
    );
  }

  return (
    <div className="space-y-6 pb-12">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/settings/terms")}
            className="flex h-10 w-10 items-center justify-center chamfer-sm border border-white/10 bg-white/5 text-white/80 transition-all hover:border-white/20 hover:bg-white/10 hover:text-white"
            title="Voltar para a lista"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="min-w-0">
            <div className="flex items-center gap-2.5">
              <h1 className="min-w-0 break-words font-display text-2xl font-bold uppercase tracking-[0.04em] text-white">
                {data.title}
              </h1>
              <span className="shrink-0 whitespace-nowrap chamfer-sm border border-accent/40 bg-accent/15 px-2.5 py-0.5 text-xs font-bold tracking-[0.12em] text-ember">
                v{data.version}
              </span>
              <TermsStatusBadge className="shrink-0" value={data.status} options={statusEnum} />
            </div>
            <p className="text-xs font-semibold text-grays-100 mt-1">
              Contrato #{data.id} • Público:{" "}
              {data.audience === "Users" ? "Usuários do App" : data.audience}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {data.canApprove && (
            <Button
              buttonStyle="secondary"
              size="sm"
              onClick={handleApprove}
            >
              <CheckCircle2 size={16} />
              Aprovar e Ativar
            </Button>
          )}

          {data.canDeprecate && (
            <Button
              buttonStyle="danger"
              size="sm"
              onClick={handleDeprecate}
            >
              <AlertOctagon size={16} />
              Depreciar
            </Button>
          )}

          {data.canEdit && (
            <Button
              buttonStyle="primary"
              size="sm"
              onClick={() =>
                openModal("Editar Contrato", <ModalEdit data={data} />, "lg")
              }
            >
              <Edit size={16} />
              Editar Contrato
            </Button>
          )}

          {!data.canEdit && data.status !== "PendingApproval" && (
            <Button
              buttonStyle="primary"
              size="sm"
              onClick={() =>
                openModal(
                  "Criar Nova Versão a partir deste",
                  <ModalEdit data={data} />,
                  "lg",
                )
              }
            >
              <CopyPlus size={16} />
              Criar Nova Versão
            </Button>
          )}

          {data.canDelete && (
            <Button
              buttonStyle="danger"
              size="sm"
              onClick={handleDelete}
              isLoading={deleteMutation.isPending}
            >
              <Trash2 size={16} />
              Excluir
            </Button>
          )}
        </div>
      </header>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <CardBox title="Dados do Contrato">
          <GridBox className="sm:grid-cols-2">
            <InfoBox>
              <CardLabel>Público</CardLabel>
              <CardValue>
                {data.audience === "Users" ? "Usuários do App" : data.audience}
              </CardValue>
            </InfoBox>
            <InfoBox>
              <CardLabel>Versão</CardLabel>
              <CardValue>v{data.version}</CardValue>
            </InfoBox>
            <InfoBox>
              <CardLabel>Situação</CardLabel>
              <CardValue>
                <TermsStatusBadge value={data.status} options={statusEnum} />
              </CardValue>
            </InfoBox>
            <InfoBox>
              <CardLabel>Total de Aceites</CardLabel>
              <CardValue>{data.acceptanceCount ?? 0} usuários</CardValue>
            </InfoBox>
            <InfoBox>
              <CardLabel>Formato</CardLabel>
              <CardValue>
                {data.fileUrl ? "Documento PDF" : "Conteúdo HTML"}
              </CardValue>
            </InfoBox>
          </GridBox>
        </CardBox>

        <CardBox title="Auditoria e Histórico">
          <GridBox className="sm:grid-cols-2">
            <InfoBox>
              <CardLabel>Cadastrado por</CardLabel>
              <CardValue>{data.createdByName || "-"}</CardValue>
            </InfoBox>
            <InfoBox>
              <CardLabel>Data de Cadastro</CardLabel>
              <CardValue>{formatDate(data.createdAt, true)}</CardValue>
            </InfoBox>
            <InfoBox>
              <CardLabel>Aprovado por</CardLabel>
              <CardValue>{data.approvedByName || "-"}</CardValue>
            </InfoBox>
            <InfoBox>
              <CardLabel>Data de Aprovação</CardLabel>
              <CardValue>
                {data.approvedAt ? formatDate(data.approvedAt, true) : "-"}
              </CardValue>
            </InfoBox>
            {data.deprecatedAt && (
              <InfoBox>
                <CardLabel>Data de Depreciação</CardLabel>
                <CardValue>{formatDate(data.deprecatedAt, true)}</CardValue>
              </InfoBox>
            )}
          </GridBox>
        </CardBox>
      </div>

      <CardBox title="Conteúdo do Contrato">
        {data.fileUrl ? (
          <div className="flex flex-col items-center justify-center gap-4 chamfer-md border border-white/10 bg-white/5 p-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center chamfer-sm bg-secondary/15 text-secondary">
              <FileText size={32} />
            </div>
            <div>
              <h3 className="font-display text-base font-bold tracking-[0.06em] text-white">
                {data.fileName || "Documento dos Termos (PDF)"}
              </h3>
              {data.fileSizeBytes ? (
                <p className="text-xs text-grays-200 mt-1">
                  {(data.fileSizeBytes / 1024 / 1024).toFixed(2)} MB
                </p>
              ) : null}
            </div>
            <a
              href={data.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 chamfer-sm border border-secondary/40 bg-secondary px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-on-accent shadow-forged hover:brightness-110 transition-all"
            >
              <ExternalLink size={16} />
              Visualizar / Baixar Documento PDF
            </a>
          </div>
        ) : data.contentHtml ? (
          <div className="chamfer-md border border-white/10 bg-white/5 p-6">
            <div
              className="tf-contract-content overflow-x-auto"
              dangerouslySetInnerHTML={{ __html: data.contentHtml }}
            />
          </div>
        ) : (
          <div className="chamfer-md border border-white/10 bg-white/5 p-8 text-center text-sm text-grays-200">
            Nenhum conteúdo em texto ou arquivo anexado.
          </div>
        )}
      </CardBox>

      <CardBox title={`Evidências de Aceite (${data.acceptanceCount ?? 0})`}>
        <div className="space-y-4">
          <p className="text-xs text-grays-200">
            Registro imutável dos usuários que aceitaram formalmente esta versão dos termos.
          </p>

          <Table
            tableContents={acceptanceColumns}
            bodyData={acceptancesData?.items ?? []}
            emptyMessage={
              isLoadingAcceptances
                ? "Carregando evidências de aceite..."
                : "Nenhum usuário aceitou esta versão até o momento."
            }
          />

          {acceptancesData && acceptancesData.items.length > 0 && (
            <Paginate
              paginationData={acceptancesData.pagination}
              onPageChange={(nextPage) => setAcceptancesPage(nextPage)}
            />
          )}
        </div>
      </CardBox>
    </div>
  );
}
