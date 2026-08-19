import type { DragEvent, MouseEvent, ReactNode } from "react";
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
}

interface ITable<T extends { id?: number | string }> {
  tableContents: ITableColumn<T>[];
  bodyData: T[];
  detailsLink?: ((item: T) => string) | string;
  bodyHeight?: string;
  scrollable?: boolean;
  emptyMessage?: string;
  getRowColor?: (row: T) => string | undefined;
  getContextOptions?: (row: T) => IMoreOptions[];
  isDraggable?: boolean;
  onReorder?: (newData: T[], draggedItem: T, targetIndex: number) => void;
}

interface TableRowProps<T extends { id?: number | string }> {
  row: T;
  index: number;
  tableContents: ITableColumn<T>[];
  columnOffsets: string[];
  isClickable: boolean;
  handleRowClick: (row: T) => void;
  handleContextMenu: (event: MouseEvent<HTMLDivElement>, row: T) => void;
  customRowColor?: string;
  isDraggable?: boolean;
  draggedIndex?: number | null;
  dragOverIndex?: number | null;
  onDragStart?: (event: DragEvent<HTMLDivElement>, index: number) => void;
  onDragOver?: (event: DragEvent<HTMLDivElement>, index: number) => void;
  onDragLeave?: (event: DragEvent<HTMLDivElement>) => void;
  onDrop?: (event: DragEvent<HTMLDivElement>, index: number) => void;
  onDragEnd?: (event: DragEvent<HTMLDivElement>) => void;
}

export type { ITable, ITableColumn, TableRowProps };

