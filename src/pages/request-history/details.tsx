import {
  CardBox,
  CardLabel,
  CardValue,
  GridBox,
  InfoBox,
} from "@/src/components/card-box/card-box";
import { Button } from "@/src/components/button/button";
import { Code } from "@/src/components/code/code";
import { InfoNotFound } from "@/src/components/page-handler/info-not-found";
import { SkeletonDetails } from "@/src/components/skeleton/skeleton-details";
import {
  INITIAL_LOGS_FILTERS,
  LOGS_COMPONENT_FILTER_KEY,
} from "@/src/features/logs/hooks/use-all-logs";
import { useRequestHistoryById } from "@/src/features/request-history/hooks/use-request-history-by-id";
import type {
  IRequestHistory,
  IRequestHistoryDetails,
} from "@/src/features/request-history/schemas/request-history.schema";
import { useComponentStore } from "@/src/store";
import { formatDate } from "@/src/utils/format";
import { useMemo } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { StatusPill } from "./components/status-pill";

const COLD_START_UPTIME_SECONDS = 120;

const PHASE_COLORS = ["bg-sky-500", "bg-emerald-500", "bg-amber-500"];

const formatMs = (value?: number) =>
  value === undefined || value === null ? "-" : `${Math.round(value)} ms`;

const formatBytes = (value?: number) =>
  value === undefined || value === null
    ? "-"
    : `${new Intl.NumberFormat("pt-BR").format(value)} bytes`;

export function RequestHistoryDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const setFiltersGlobal = useComponentStore((state) => state.setFilters);

  const requestId = useMemo(() => {
    const parsed = Number(id);
    return Number.isFinite(parsed) ? parsed : undefined;
  }, [id]);

  const { data, isLoading, isError } = useRequestHistoryById(requestId);
  const diagnostics = useMemo(() => parseDetails(data?.details), [data]);

  if (isLoading) return <SkeletonDetails />;
  if (isError || !data)
    return <InfoNotFound message="Registro de requisição não encontrado." />;

  const phases = [
    { label: "Pipeline", value: data.pipelineMs },
    { label: "Action", value: data.actionMs },
    { label: "Resposta", value: data.responseMs },
  ].filter((phase) => phase.value !== undefined && phase.value !== null);

  const phasesTotal =
    data.totalMs ?? phases.reduce((sum, phase) => sum + (phase.value ?? 0), 0);
  const hasNoAction = data.actionMs === undefined || data.actionMs === null;
  const isColdStart =
    data.processUptimeSeconds !== undefined &&
    data.processUptimeSeconds !== null &&
    data.processUptimeSeconds < COLD_START_UPTIME_SECONDS;

  const openLogsByErrorCode = (errorCode: string) => {
    setFiltersGlobal(LOGS_COMPONENT_FILTER_KEY, {
      ...INITIAL_LOGS_FILTERS,
      search: errorCode,
      page: 1,
    });
    navigate("/logs");
  };

  const errorCode = data.errorCode || diagnostics?.errorCode;

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/request-history")}
            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-primary/60 text-white/80 transition-all hover:border-white/20 hover:bg-white/10 hover:text-white"
            title="Voltar para a lista"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold uppercase tracking-tight text-white">
                Requisição #{data.id}
              </h1>
              <StatusPill statusCode={data.statusCode} />
            </div>
            <p className="truncate text-xs font-semibold text-grays-100">
              {data.method || "-"} {data.path || data.route || ""}
            </p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="flex flex-col justify-between rounded-3xl border border-white/10 bg-primary/40 p-5 backdrop-blur-md shadow-xl">
          <span className="text-xs font-bold uppercase tracking-wider text-grays-200">
            Tempo total
          </span>
          <div className="mt-2 text-2xl font-extrabold text-white">
            {formatMs(data.totalMs)}
          </div>
          <span className="mt-1 text-[10px] font-bold text-white/60">
            Da entrada à resposta
          </span>
        </div>

        <div className="flex flex-col justify-between rounded-3xl border border-white/10 bg-primary/40 p-5 backdrop-blur-md shadow-xl">
          <span className="text-xs font-bold uppercase tracking-wider text-grays-200">
            Banco
          </span>
          <div
            className={`mt-2 text-2xl font-extrabold ${
              data.dbFailedCommands ? "text-red-400" : "text-white"
            }`}
          >
            {formatMs(data.dbMs)}
          </div>
          <span className="mt-1 text-[10px] font-bold text-white/60">
            {data.dbCommands ?? 0} comando(s)
            {data.dbFailedCommands
              ? ` · ${data.dbFailedCommands} com falha`
              : ""}
          </span>
        </div>

        <div className="flex flex-col justify-between rounded-3xl border border-white/10 bg-primary/40 p-5 backdrop-blur-md shadow-xl">
          <span className="text-xs font-bold uppercase tracking-wider text-grays-200">
            Status HTTP
          </span>
          <div className="mt-2 text-2xl font-extrabold text-white">
            {data.statusCode ?? "-"}
          </div>
          <span className="mt-1 text-[10px] font-bold text-white/60">
            Resposta do Servidor
          </span>
        </div>

        <div className="flex flex-col justify-between rounded-3xl border border-white/10 bg-primary/40 p-5 backdrop-blur-md shadow-xl">
          <span className="text-xs font-bold uppercase tracking-wider text-grays-200">
            Uptime do processo
          </span>
          <div className="mt-2 text-2xl font-extrabold text-white">
            {data.processUptimeSeconds !== undefined &&
            data.processUptimeSeconds !== null
              ? `${data.processUptimeSeconds}s`
              : "-"}
          </div>
          <span className="mt-1 text-[10px] font-bold text-white/60">
            {isColdStart ? "cold start" : "Tempo desde a subida da API"}
          </span>
        </div>
      </div>

      <CardBox title="Fases da requisição">
        {phases.length > 0 ? (
          <div className="flex flex-col gap-3">
            <div className="flex h-3 w-full overflow-hidden rounded-full border border-white/10 bg-white/5">
              {phases.map((phase, index) => (
                <div
                  key={phase.label}
                  className={PHASE_COLORS[index % PHASE_COLORS.length]}
                  style={{
                    width: phasesTotal
                      ? `${((phase.value ?? 0) / phasesTotal) * 100}%`
                      : "0%",
                  }}
                />
              ))}
            </div>
            <div className="flex flex-wrap gap-4">
              {phases.map((phase, index) => (
                <div key={phase.label} className="flex items-center gap-2">
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
                      PHASE_COLORS[index % PHASE_COLORS.length]
                    }`}
                  />
                  <span className="text-xs font-bold text-grays-100">
                    {phase.label}: {formatMs(phase.value)}
                  </span>
                </div>
              ))}
            </div>
            {hasNoAction && (
              <span className="text-xs text-grays-200">
                Nenhuma action executada.
              </span>
            )}
          </div>
        ) : (
          <span className="text-xs text-grays-200">
            Sem tempos por fase registrados.
          </span>
        )}
      </CardBox>

      <CardBox title="Dados da requisição">
        <GridBox className="lg:grid-cols-3">
          <InfoBox>
            <CardLabel>Rota</CardLabel>
            <CardValue className="break-all font-mono text-secondary-light">
              {data.route ?? "-"}
            </CardValue>
          </InfoBox>
          <InfoBox className="lg:col-span-2">
            <CardLabel>Caminho</CardLabel>
            <CardValue className="break-all font-mono text-secondary-light">
              {data.path ?? "-"}
            </CardValue>
          </InfoBox>
          <InfoBox className="lg:col-span-3">
            <CardLabel>Query</CardLabel>
            <CardValue className="break-all font-mono">
              {data.query || "-"}
            </CardValue>
          </InfoBox>
          <InfoBox>
            <CardLabel>Usuário</CardLabel>
            <CardValue>
              {data.userLogin
                ? `${data.userLogin} (${data.userId ?? "-"})`
                : "Anônimo"}
            </CardValue>
          </InfoBox>
          <InfoBox>
            <CardLabel>Endereço IP</CardLabel>
            <CardValue className="break-all">{data.ipAddress ?? "-"}</CardValue>
          </InfoBox>
          <InfoBox>
            <CardLabel>Tamanho da resposta</CardLabel>
            <CardValue>{formatBytes(data.responseSize)}</CardValue>
          </InfoBox>
          <InfoBox className="lg:col-span-3">
            <CardLabel>User agent</CardLabel>
            <CardValue className="break-all">{data.userAgent ?? "-"}</CardValue>
          </InfoBox>
          <InfoBox>
            <CardLabel>Data</CardLabel>
            <CardValue>
              {data.createdAt ? formatDate(data.createdAt, true) : "-"}
            </CardValue>
          </InfoBox>
          <InfoBox>
            <CardLabel>Expira em</CardLabel>
            <CardValue>{data.ttl ? formatDate(data.ttl, true) : "-"}</CardValue>
          </InfoBox>
          {errorCode && (
            <InfoBox>
              <CardLabel>Código do erro</CardLabel>
              <CardValue className="flex flex-col items-start gap-2">
                <span className="break-all font-mono">{errorCode}</span>
                <Button
                  type="button"
                  buttonStyle="soft"
                  size="xs"
                  onClick={() => openLogsByErrorCode(errorCode)}
                >
                  Ver em Logs
                </Button>
              </CardValue>
            </InfoBox>
          )}
        </GridBox>
      </CardBox>

      {data.details && !diagnostics && (
        <CardBox title="Diagnóstico">
          <Code>{data.details}</Code>
        </CardBox>
      )}

      {diagnostics && (
        <>
          {diagnostics.database?.slowestCommands?.length ? (
            <CardBox title="Comandos mais lentos">
              <div className="flex flex-col gap-3">
                {diagnostics.database.slowestCommands.map((command, index) => (
                  <div key={index} className="flex flex-col gap-1">
                    <span
                      className={`text-xs font-bold ${
                        command.failed ? "text-red-400" : "text-grays-100"
                      }`}
                    >
                      {formatMs(command.ms)}
                      {command.failed ? " · falhou" : ""}
                    </span>
                    <Code>{command.sql ?? "-"}</Code>
                  </div>
                ))}
              </div>
            </CardBox>
          ) : null}

          {diagnostics.runtime && (
            <CardBox title="Runtime">
              <GridBox className="lg:grid-cols-4">
                <InfoBox>
                  <CardLabel>Memória gerenciada</CardLabel>
                  <CardValue>
                    {diagnostics.runtime.totalMemoryMb ?? "-"} MB
                  </CardValue>
                </InfoBox>
                <InfoBox>
                  <CardLabel>Working set</CardLabel>
                  <CardValue>
                    {diagnostics.runtime.workingSetMb ?? "-"} MB
                  </CardValue>
                </InfoBox>
                <InfoBox>
                  <CardLabel>Coletas de GC</CardLabel>
                  <CardValue>
                    {`gen0 ${diagnostics.runtime.gen0Collections ?? 0} · gen1 ${
                      diagnostics.runtime.gen1Collections ?? 0
                    } · gen2 ${diagnostics.runtime.gen2Collections ?? 0}`}
                  </CardValue>
                </InfoBox>
                <InfoBox>
                  <CardLabel>Threads</CardLabel>
                  <CardValue>
                    {`${diagnostics.runtime.threadCount ?? "-"} · ${
                      diagnostics.runtime.pendingWorkItems ?? 0
                    } pendente(s)`}
                  </CardValue>
                </InfoBox>
              </GridBox>
            </CardBox>
          )}

          {diagnostics.request?.body && (
            <CardBox title="Corpo da requisição">
              <div className="flex flex-col gap-2">
                <span className="text-xs text-grays-200">
                  Campos sensíveis mascarados pelo backend.
                </span>
                <Code>{diagnostics.request.body}</Code>
              </div>
            </CardBox>
          )}
        </>
      )}
    </div>
  );
}

function parseDetails(
  details?: IRequestHistory["details"],
): IRequestHistoryDetails | null {
  if (!details) return null;

  try {
    const parsed = JSON.parse(details);
    if (typeof parsed === "object" && parsed !== null) {
      return parsed as IRequestHistoryDetails;
    }
  } catch {
    return null;
  }

  return null;
}
