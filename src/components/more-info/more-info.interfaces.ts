import type { ReactNode } from "react";
import type { TSide } from "@/src/components/info/info";
import type { IMoreOptions } from "@/src/interfaces/get-more-options.interface";

interface IMoreInfo {
  options: IMoreOptions[];
  boxSide?: TSide;
  item?: Record<string, unknown>;
  children?: ReactNode;
}

export type { IMoreInfo };
