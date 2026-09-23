import { X } from "lucide-react";
import { memo, useEffect, useRef } from "react";
import { ButtonIcon } from "@/src/components/button-icon/button-icon";
import { KeystoneIcon } from "@/src/components/icons/icons";
import type { IModalInstance } from "@/src/store/types";
import type { TModalSize } from "@/src/components/modals/modal.interface";
import { useBoundStore } from "@/src/store/use-bound-store";

const SIZES: Record<TModalSize, string> = {
  xl: "98vw",
  lg: "85vw",
  md: "64vw",
  sm: "35vw",
  xs: "28vw",
  full: "100%",
};

const ModalItem = memo(
  ({
    modal,
    index,
    isTopMost,
    closeModal,
  }: {
    modal: IModalInstance;
    index: number;
    isTopMost: boolean;
    closeModal: () => void;
  }) => {
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (!isTopMost) return;

      const focusableSelector =
        'a[href], area[href], input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [contenteditable], [tabindex]:not([tabindex="-1"])';

      const getFocusableElements = () =>
        Array.from(
          wrapperRef.current?.querySelectorAll<HTMLElement>(
            focusableSelector,
          ) ?? [],
        ).filter((element) => element.getClientRects().length > 0);

      const focusFirstElement = () => {
        const focusableElements = getFocusableElements();
        const firstElement = focusableElements[0] ?? wrapperRef.current;
        firstElement?.focus();
      };

      const frameId = window.requestAnimationFrame(focusFirstElement);

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          closeModal();
          return;
        }

        if (
          event.key !== "Tab" ||
          event.altKey ||
          event.ctrlKey ||
          event.metaKey
        ) {
          return;
        }

        const focusableElements = getFocusableElements();

        if (focusableElements.length === 0) {
          event.preventDefault();
          wrapperRef.current?.focus();
          return;
        }

        const currentElement = document.activeElement as HTMLElement | null;
        const currentIndex = currentElement
          ? focusableElements.indexOf(currentElement)
          : -1;

        let nextIndex = 0;

        if (currentIndex === -1) {
          nextIndex = event.shiftKey ? focusableElements.length - 1 : 0;
        } else if (event.shiftKey) {
          nextIndex =
            currentIndex <= 0 ? focusableElements.length - 1 : currentIndex - 1;
        } else {
          nextIndex =
            currentIndex >= focusableElements.length - 1
              ? 0
              : currentIndex + 1;
        }

        event.preventDefault();
        focusableElements[nextIndex]?.focus();
      };

      document.addEventListener("keydown", handleKeyDown);

      return () => {
        window.cancelAnimationFrame(frameId);
        document.removeEventListener("keydown", handleKeyDown);
      };
    }, [closeModal, isTopMost]);

    const size = modal.size ?? "md";

    return (
      <div
        className="fixed inset-0 flex items-center justify-center bg-black/80 p-3 sm:p-5 transition-all duration-200"
        style={{ zIndex: 1000 + index }}
      >
        <button
          type="button"
          onClick={closeModal}
          className="absolute inset-0 cursor-default"
          aria-label="Fechar modal"
          disabled={!isTopMost}
        />

        <section
          ref={wrapperRef}
          role="dialog"
          aria-modal="true"
          tabIndex={-1}
          className="relative flex max-h-[96vh] min-w-[300px] flex-col overflow-hidden chamfer-md border border-white/15 bg-surface"
          style={{
            width: SIZES[size],
            maxWidth: size === "full" ? "100vw" : "95vw",
            minWidth: size === "xs" ? "240px" : "300px",
            transition: "opacity 0.2s ease, transform 0.2s ease",
          }}
        >
          <header className="flex items-center justify-between gap-3 border-b border-white/10 bg-card px-6 py-4 max-[992px]:px-4 max-[992px]:py-3">
            <h3 className="flex min-w-0 items-center gap-2.5 font-display text-lg font-bold uppercase tracking-[0.04em] text-white">
              <KeystoneIcon className="h-3.5 w-3.5 shrink-0 text-accent" aria-hidden="true" />
              <span className="truncate">{modal.title}</span>
            </h3>

            <ButtonIcon
              onClick={closeModal}
              disabled={!isTopMost}
              aria-label="Fechar modal"
              hasHoverEffect
              size="34px"
              className="border border-white/10 text-white/80 hover:text-white hover:border-secondary/40 hover:bg-secondary/20 transition-all disabled:pointer-events-none disabled:opacity-40"
            >
              <X size={18} />
            </ButtonIcon>
          </header>

          <div className="flex flex-1 flex-col gap-3 overflow-y-auto px-6 py-5 text-sm text-white/90 max-[992px]:px-4 max-[992px]:py-3">
            {modal.content}
          </div>

          {modal.footer ? (
            <footer className="sticky bottom-0 z-10 flex items-center justify-end gap-3 border-t border-white/10 bg-card px-6 py-4 max-[992px]:px-4 max-[992px]:py-3">
              {modal.footer}
            </footer>
          ) : null}
        </section>
      </div>
    );
  },
);

ModalItem.displayName = "ModalItem";

export const GlobalModal = () => {
  const modals = useBoundStore((state) => state.modals);
  const closeModal = useBoundStore((state) => state.closeModal);

  return (
    <>
      {modals.map((modal, index) => (
        <ModalItem
          key={modal.id}
          modal={modal}
          index={index}
          isTopMost={index === modals.length - 1}
          closeModal={closeModal}
        />
      ))}
    </>
  );
};
