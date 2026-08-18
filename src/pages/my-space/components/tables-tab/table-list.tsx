import type { ISpaceTable } from "@/src/features/spaces/schemas/spaces.schema";
import { Table } from "@/src/components/table/table";
import type { ITableColumn } from "@/src/components/table/table.interfaces";
import { Button } from "@/src/components/button/button";
import { MdModeEdit } from "react-icons/md";
import { SpaceTableStatus } from "@/src/features/spaces/components/space-table-status";
import { useBoundStore } from "@/src/store";
import { ModalEditTable } from "../modal-edit-table/modal-edit-table";

interface IProps {
  tables: ISpaceTable[];
}

export function TableList({ tables }: IProps) {
  const openModal = useBoundStore((state) => state.openModal);

  const tableContents: ITableColumn<ISpaceTable>[] = [
    {
      title: "Nome",
      key: "name",
      width: "180px",
      normalCase: true,
      render: (table) => (
        <span className="font-semibold text-white">{table.name}</span>
      ),
    },
    {
      title: "Formato",
      key: "shape",
      width: "140px",
      render: (table) => table.shape,
    },
    {
      title: "Assentos",
      key: "seatCount",
      width: "110px",
      align: "center",
      render: (table) => table.seatCount,
    },
    {
      title: "Status",
      key: "isActive",
      width: "140px",
      render: (table) => <SpaceTableStatus isActive={table.isActive} />,
    },
    {
      title: "",
      key: "actions",
      width: "140px",
      align: "right",
      render: (table) => (
        <Button
          buttonStyle="hollow"
          size="sm"
          onClick={() =>
            openModal(
              "Editar Mesa",
              <ModalEditTable spaceId={table.spaceId} data={table} />,
              "md",
            )
          }
        >
          <MdModeEdit />
          Editar
        </Button>
      ),
    },
  ];

  return (
    <Table
      tableContents={tableContents}
      bodyData={tables}
      bodyHeight="100%"
      detailsLink=""
    />
  );
}
