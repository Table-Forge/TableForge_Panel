import {
  CardBox,
  CardLabel,
  CardValue,
  GridBox,
  InfoBox,
} from "@/src/components/card-box/card-box";
import { Code } from "@/src/components/code/code";
import { InfoNotFound } from "@/src/components/page-handler/info-not-found";
import { SkeletonDetails } from "@/src/components/skeleton/skeleton-details";
import { useLogById } from "@/src/features/logs/hooks/use-log-by-id";
import type { ILog } from "@/src/features/logs/schemas/log.schema";
import { formatDate } from "@/src/utils/format";
import { pickText } from "@/src/utils/pick-text";
import { useMemo } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

export function LogDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const logId = useMemo(() => {
    const parsed = Number(id);
    return Number.isFinite(parsed) ? parsed : undefined;
  }, [id]);

  const { data, isLoading, isError } = useLogById(logId);
  const createdOn = data?.dateCreated ?? data?.createdAt;
  const structuredContent = useMemo(
    () => getStructuredLogContent(data),
    [data],
  );

  if (isLoading) return <SkeletonDetails />;
  if (isError || !data) return <InfoNotFound />;

  const isSuccessStatus = Boolean(
    data.statusCode && data.statusCode >= 200 && data.statusCode < 300
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Header Toolbar */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/logs")}
            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-primary/60 text-white/80 transition-all hover:border-white/20 hover:bg-white/10 hover:text-white"
            title="Voltar para a lista"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold uppercase tracking-tight text-white">
                Log #{data.id}
              </h1>
              <span
                className={`rounded-full border px-3 py-0.5 text-xs font-extrabold tracking-wide ${
                  isSuccessStatus
                    ? "border-emerald-500/30 bg-emerald-500/20 text-emerald-300"
                    : "border-red-500/30 bg-red-500/20 text-red-300"
                }`}
              >
                HTTP {data.statusCode ?? "ERR"}
              </span>
            </div>
            <p className="truncate text-xs font-semibold text-grays-100">
              {data.endpoint || "Endpoint não especificado"}
            </p>
          </div>
        </div>
      </header>

      {/* KPI Stat Cards Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="flex flex-col justify-between rounded-3xl border border-white/10 bg-primary/40 p-5 backdrop-blur-md shadow-xl">
          <span className="text-xs font-bold uppercase tracking-wider text-grays-200">
            Status HTTP
          </span>
          <div
            className={`mt-2 text-2xl font-extrabold ${
              isSuccessStatus ? "text-emerald-400" : "text-red-400"
            }`}
          >
            {data.statusCode ?? "-"}
          </div>
          <span className="mt-1 text-[10px] font-bold text-white/60">
            Resposta do Servidor
          </span>
        </div>

        <div className="flex flex-col justify-between rounded-3xl border border-white/10 bg-primary/40 p-5 backdrop-blur-md shadow-xl">
          <span className="text-xs font-bold uppercase tracking-wider text-grays-200">
            Tipo de Log
          </span>
          <div className="mt-2 text-xl font-extrabold text-white truncate">
            {data.type || "Geral"}
          </div>
          <span className="mt-1 text-[10px] font-bold text-white/60">
            Categoria do Registro
          </span>
        </div>

        <div className="flex flex-col justify-between rounded-3xl border border-white/10 bg-primary/40 p-5 backdrop-blur-md shadow-xl">
          <span className="text-xs font-bold uppercase tracking-wider text-grays-200">
            Endereço IP
          </span>
          <div className="mt-2 text-lg font-extrabold text-white truncate">
            {data.ipAddress || "-"}
          </div>
          <span className="mt-1 text-[10px] font-bold text-white/60">
            Origem da Requisição
          </span>
        </div>

        <div className="flex flex-col justify-between rounded-3xl border border-white/10 bg-primary/40 p-5 backdrop-blur-md shadow-xl">
          <span className="text-xs font-bold uppercase tracking-wider text-grays-200">
            Data e Hora
          </span>
          <div className="mt-2 text-sm font-extrabold text-white">
            {createdOn ? formatDate(createdOn, true) : "-"}
          </div>
          <span className="mt-1 text-[10px] font-bold text-white/60">
            Data de Registro
          </span>
        </div>
      </div>

      {/* Main Metadata Section */}
      <CardBox title="Parâmetros Técnicos">
        <GridBox className="lg:grid-cols-3">
          <InfoBox>
            <CardLabel>ID do Registro</CardLabel>
            <CardValue>{String(data.id ?? "-")}</CardValue>
          </InfoBox>
          <InfoBox>
            <CardLabel>Código Interno</CardLabel>
            <CardValue>{data.code ?? "-"}</CardValue>
          </InfoBox>
          <InfoBox>
            <CardLabel>ID do Usuário Solicitante</CardLabel>
            <CardValue>{String(data.userId ?? "-")}</CardValue>
          </InfoBox>
          <InfoBox className="lg:col-span-3">
            <CardLabel>Endpoint</CardLabel>
            <CardValue className="break-all font-mono text-secondary-light">
              {data.endpoint ?? "-"}
            </CardValue>
          </InfoBox>
        </GridBox>
      </CardBox>

      {/* Log Content Sections */}
      <CardBox title="Mensagem Principal">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 font-mono text-xs leading-relaxed text-white/90">
          {structuredContent.message}
        </div>
      </CardBox>

      {structuredContent.stackTrace !== "-" && (
        <CardBox title="Rastreamento (Stack Trace)">
          <Code>{structuredContent.stackTrace}</Code>
        </CardBox>
      )}

      {structuredContent.innerExceptionMessage !== "-" && (
        <CardBox title="Exceção Interna">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 font-mono text-xs leading-relaxed text-red-300">
            {structuredContent.innerExceptionMessage}
          </div>
        </CardBox>
      )}

      {structuredContent.innerExceptionStackTrace !== "-" && (
        <CardBox title="Rastreamento da Exceção Interna">
          <Code>{structuredContent.innerExceptionStackTrace}</Code>
        </CardBox>
      )}
    </div>
  );
}

function getStructuredLogContent(log?: ILog | null) {
  const fallback = {
    message: log?.message ?? "-",
    stackTrace: log?.stackTrace ?? "-",
    innerExceptionMessage: log?.innerExceptionMessage ?? "-",
    innerExceptionStackTrace: log?.innerExceptionStackTrace ?? "-",
  };

  if (!log?.details) return fallback;

  const parsed = parseJsonObject(log.details);
  if (!parsed) return fallback;

  return {
    message: pickText(parsed, ["message", "Message"], fallback.message),
    stackTrace: pickText(
      parsed,
      ["stackTrace", "StackTrace"],
      fallback.stackTrace,
    ),
    innerExceptionMessage: pickText(
      parsed,
      ["innerExceptionMessage", "InnerExceptionMessage"],
      fallback.innerExceptionMessage,
    ),
    innerExceptionStackTrace: pickText(
      parsed,
      ["innerExceptionStackTrace", "InnerExceptionStackTrace"],
      fallback.innerExceptionStackTrace,
    ),
  };
}

function parseJsonObject(value: string): Record<string, unknown> | null {
  try {
    const parsed = JSON.parse(value);
    if (typeof parsed === "object" && parsed !== null) {
      return parsed as Record<string, unknown>;
    }
  } catch {
    return null;
  }

  return null;
}
