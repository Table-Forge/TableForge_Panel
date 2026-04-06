import { X } from "lucide-react";
import { useBoundStore } from "@/src/store/use-bound-store";

const sizes = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
  full: "max-w-[95vw]",
} as const;

export const GlobalModal = () => {
  const modal = useBoundStore((state) => state.modal);
  const closeModal = useBoundStore((state) => state.closeModal);

  if (!modal.isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center md:items-center">
      <button
        type="button"
        onClick={closeModal}
        className="absolute inset-0 bg-background/70 backdrop-blur-sm"
        aria-label="Fechar modal"
      />

      <section
        className={`relative z-[101] flex max-h-[90vh] w-full flex-col rounded-t-2xl border border-white/15 bg-primary shadow-2xl md:rounded-2xl ${sizes[modal.size]}`}
      >
        <header className="flex items-center justify-between border-b border-white/10 px-5 py-3">
          <h3 className="text-base font-semibold text-white">{modal.title}</h3>
          <button
            type="button"
            onClick={closeModal}
            className="rounded-full p-1 text-white/70 transition hover:bg-white/10 hover:text-white"
            aria-label="Fechar modal"
          >
            <X size={18} />
          </button>
        </header>

        <div className="overflow-y-auto p-5 text-sm text-white/90">
          {modal.content}
        </div>
      </section>
    </div>
  );
};
