import { Button } from "@/src/components/button/button";
import {
  CardBox,
  CardLabel,
  CardValue,
  GridBox,
  InfoBox,
} from "@/src/components/card-box/card-box";
import { Code } from "@/src/components/code/code";
import { InfoNotFound } from "@/src/components/page-handler/info-not-found";
import { SkeletonTable } from "@/src/components/skeleton/skeleton-table";
import { useLogById } from "@/src/features/logs/hooks/use-log-by-id";
import type { ILog } from "@/src/features/logs/schemas/log.schema";
import { formatDate } from "@/src/utils/format";
import { pickText } from "@/src/utils/pick-text";
import { useMemo } from "react";
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

  if (isLoading) return <SkeletonTable />;
  if (isError || !data) return <InfoNotFound />;

  return (
    <div className="flex flex-col gap-4">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-tight text-white">
            Log {data.id ?? "-"}
          </h1>
          <p className="text-sm text-grays-100">
            Detalhes completos do registro.
          </p>
        </div>

        <Button
          buttonStyle="hollow"
          size="sm"
          onClick={() => navigate("/logs")}
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
            <CardLabel>Tipo</CardLabel>
            <CardValue className="mt-1 block break-all">
              {data.type ?? "-"}
            </CardValue>
          </InfoBox>
          <InfoBox>
            <CardLabel>Código</CardLabel>
            <CardValue className="mt-1 block break-all">
              {data.code ?? "-"}
            </CardValue>
          </InfoBox>
          <InfoBox>
            <CardLabel>Status</CardLabel>
            <CardValue className="mt-1 block break-all">
              {String(data.statusCode ?? "-")}
            </CardValue>
          </InfoBox>
          <InfoBox>
            <CardLabel>Data</CardLabel>
            <CardValue className="mt-1 block break-all">
              {createdOn ? formatDate(createdOn, true) : "-"}
            </CardValue>
          </InfoBox>
          <InfoBox>
            <CardLabel>IP</CardLabel>
            <CardValue className="mt-1 block break-all">
              {data.ipAddress ?? "-"}
            </CardValue>
          </InfoBox>
          <InfoBox>
            <CardLabel>Usuário ID</CardLabel>
            <CardValue className="mt-1 block break-all">
              {String(data.userId ?? "-")}
            </CardValue>
          </InfoBox>
        </GridBox>
      </CardBox>

      <CardBox title="Endpoint">
        <CardValue className="block break-all">
          {data.endpoint ?? "-"}
        </CardValue>
      </CardBox>

      <CardBox title="Mensagem">
        <CardValue className="block whitespace-pre-wrap break-words font-medium">
          {structuredContent.message}
        </CardValue>
      </CardBox>

      <CardBox title="Rastreamento">
        <Code>
          {structuredContent.stackTrace}
        </Code>
      </CardBox>

      <CardBox title="Mensagem da Exceção Interna">
        <CardValue className="block whitespace-pre-wrap break-words font-medium">
          {structuredContent.innerExceptionMessage}
        </CardValue>
      </CardBox>

      <CardBox title="Rastreamento da Exceção Interna">
        <Code>
          {structuredContent.innerExceptionStackTrace}
        </Code>
      </CardBox>
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
