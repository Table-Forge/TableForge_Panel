import type { MouseEvent, ReactNode } from "react";
import type { IMoreOptions } from "@/src/interfaces/get-more-options.interface";

interface ITableColumn<T> {
  title: ReactNode | string;
  key: keyof T | string;
  width?: string;
  align?: "left" | "center" | "right";
  fixed?: boolean;
  show?: boolean;
  render?: (row: T) => ReactNode;
  normalCase?: boolean;
  type?: "critical";
}

interface ITable<T extends { id?: number | string }> {
  tableContents: ITableColumn<T>[];
  bodyData: T[];
  detailsLink?: ((item: T) => string) | string;
  bodyHeight?: string;
  scrollable?: boolean;
  getRowColor?: (row: T) => string | undefined;
  getContextOptions?: (row: T) => IMoreOptions[];
}

interface TableRowProps<T extends { id?: number | string }> {
  row: T;
  tableContents: ITableColumn<T>[];
  columnOffsets: string[];
  gridTemplateColumns: string;
  isClickable: boolean;
  handleRowClick: (row: T) => void;
  handleContextMenu: (event: MouseEvent<HTMLDivElement>, row: T) => void;
  customRowColor?: string;
}

export type { ITable, ITableColumn, TableRowProps };
