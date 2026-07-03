import { useBoundStore } from "@/src/store/use-bound-store";

export const useHandleCopy = () => {
  const addToast = useBoundStore((state) => state.addToast);

  const handleCopy = async (text: string, message?: string) => {
    try {
      await navigator.clipboard.writeText(text);
      addToast("success", message ?? "Texto copiado!");
    } catch (error) {
      console.error("Failed to copy", error);
      addToast("error", "Erro ao copiar.");
    }
  };

  return { handleCopy };
};
