import { z } from "zod";
import {
  dateOptional,
  numberOptional,
  stringOptional,
} from "@/src/utils/custom-schema-validations";

export const RequestHistoryListSchema = z.object({
  id: numberOptional,
  createdAt: dateOptional,
  method: stringOptional,
  route: stringOptional,
  path: stringOptional,
  statusCode: numberOptional,
  userId: numberOptional,
  userLogin: stringOptional,
  ipAddress: stringOptional,
  pipelineMs: numberOptional,
  actionMs: numberOptional,
  responseMs: numberOptional,
  totalMs: numberOptional,
  dbCommands: numberOptional,
  dbMs: numberOptional,
  dbFailedCommands: numberOptional,
  errorCode: stringOptional,
  processUptimeSeconds: numberOptional,
  hasDetails: z.boolean().optional(),
});

export const RequestHistorySchema = RequestHistoryListSchema.extend({
  ttl: dateOptional,
  query: stringOptional,
  userAgent: stringOptional,
  responseSize: numberOptional,
  details: stringOptional,
});

export type IRequestHistoryItem = z.infer<typeof RequestHistoryListSchema>;
export type IRequestHistory = z.infer<typeof RequestHistorySchema>;

export type IRequestHistoryDetails = {
  phases?: {
    pipelineMs?: number;
    actionMs?: number;
    responseMs?: number;
    totalMs?: number;
  };
  database?: {
    commands?: number;
    totalMs?: number;
    failedCommands?: number;
    connectionsOpened?: number;
    connectionOpenMs?: number;
    slowestCommands?: { ms?: number; failed?: boolean; sql?: string }[];
  };
  runtime?: {
    processUptimeSeconds?: number;
    gen0Collections?: number;
    gen1Collections?: number;
    gen2Collections?: number;
    totalMemoryMb?: number;
    workingSetMb?: number;
    threadCount?: number;
    pendingWorkItems?: number;
  };
  request?: {
    contentType?: string;
    contentLength?: number;
    clientAborted?: boolean;
    body?: string;
  };
  response?: { contentType?: string; size?: number };
  errorCode?: string;
};
