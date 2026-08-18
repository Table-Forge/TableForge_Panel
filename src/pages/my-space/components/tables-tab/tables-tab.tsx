import { Button } from "@/src/components/button/button";
import { CardBox } from "@/src/components/card-box/card-box";
import { SkeletonTable } from "@/src/components/skeleton/skeleton-table";
import { useSpaceTables } from "@/src/features/spaces/hooks/use-spaces-queries";
import { MdAdd } from "react-icons/md";
import { TableList } from "./table-list";

import { useBoundStore } from "@/src/store";
import { ModalEditTable } from "../modal-edit-table/modal-edit-table";

interface IProps {
  spaceId: number;
}

export function TablesTab({ spaceId }: IProps) {
  const { tables, isLoadingTables: isLoading } = useSpaceTables(spaceId);
  const openModal = useBoundStore((state) => state.openModal);

  return (
    <CardBox 
      title={
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white">
            Mesas Disponíveis
          </h3>
          <Button 
            buttonStyle="primary" 
            size="sm" 
            onClick={() => openModal("Adicionar Mesa", <ModalEditTable spaceId={spaceId} />, "md")}
          >
            <MdAdd />
            Adicionar Mesa
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        {isLoading ? (
          <SkeletonTable />
        ) : tables && tables.length > 0 ? (
          <TableList tables={tables} />
        ) : (
          <p className="text-center text-sm text-grays-100 py-6">
            Nenhuma mesa cadastrada neste espaço.
          </p>
        )}
      </div>
    </CardBox>
  );
}
