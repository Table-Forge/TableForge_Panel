import { CopyPlus } from "lucide-react";
import { ButtonIcon } from "@/src/components/button-icon/button-icon";

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
    <ButtonIcon
      onClick={onReplicate}
      hasHoverEffect
      size="28px"
      title={title}
      aria-label={title}
    >
      <CopyPlus size={18} />
    </ButtonIcon>
  );
};
