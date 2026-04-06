import type { ReactNode } from "react";

interface ITableColumn<T> {
  title: ReactNode | string;
  key: keyof T | string;
  width?: string;
  align?: "left" | "center" | "right";
  fixed?: boolean;
  render?: (row: T) => ReactNode;
  normalCase?: boolean;
  type?: "critical";
}

interface ITable<T extends { id: string | number }> {
  headerData: ITableColumn<T>[];
  bodyData: T[];
  detailsLink?: ((item: T) => string) | string;
  bodyHeight?: string;
  scrollable?: boolean;
}

export type { ITableColumn, ITable };
