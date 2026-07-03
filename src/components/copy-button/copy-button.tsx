import { Copy } from "lucide-react";
import { ButtonIcon } from "@/src/components/button-icon/button-icon";
import { useHandleCopy } from "@/src/hooks/utils/use-handle-copy";

export const CopyButton: React.FC<{ text: string; title?: string }> = ({
  text,
  title = "Copiar",
}) => {
  const { handleCopy } = useHandleCopy();

  return (
    <ButtonIcon
      className="flex cursor-pointer items-center justify-center gap-1"
      title={title}
      aria-label={title}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handleCopy(text);
      }}
    >
      <Copy size={16} className="text-grays-300" />
    </ButtonIcon>
  );
};
