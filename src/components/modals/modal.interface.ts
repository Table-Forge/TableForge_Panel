import type { ReactNode } from "react";
import type { ZodTypeAny } from "zod";

type TModalSize = "xs" | "sm" | "md" | "lg" | "xl" | "full";

type TGenericObject = Record<string, unknown> | null;

interface IStep {
  id: number;
  title?: string;
  current: boolean;
  schema?: ZodTypeAny;
  content?: ReactNode;
}

interface IStepConfig {
  firstStep: number;
  lastStep: number;
}

export type { IStep, IStepConfig, TGenericObject, TModalSize };
