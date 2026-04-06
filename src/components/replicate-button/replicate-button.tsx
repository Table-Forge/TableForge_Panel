import { CopyPlus } from "lucide-react";

interface ReplicateButtonProps {
  index: number;
  onReplicate: () => void;
  title?: string;
}

export const ReplicateButton = ({
  index,
  onReplicate,
  title = "Replicar valor para os demais",
}: ReplicateButtonProps) => {
  if (index !== 0) return null;

  return (
    <button
      type="button"
      onClick={onReplicate}
      className="cursor-pointer text-grays-100 transition hover:scale-105 hover:text-tertiary active:scale-95"
      title={title}
    >
      <CopyPlus size={18} />
    </button>
  );
};
