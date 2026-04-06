import { createPortal } from "react-dom";
import { Toast } from "./toast";
import { useBoundStore } from "@/src/store/use-bound-store";

export const ToastContainer = () => {
  const toasts = useBoundStore((state) => state.toasts);
  const removeToast = useBoundStore((state) => state.removeToast);

  if (toasts.length === 0) return null;

  return createPortal(
    <div
      className="pointer-events-none fixed inset-0 flex items-start justify-end p-4"
      style={{ zIndex: 2147483647 }}
    >
      <div className="flex max-h-full w-full max-w-[420px] flex-col gap-3 overflow-y-auto pr-1">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <Toast
              id={toast.id}
              type={toast.type}
              message={toast.message}
              onClose={removeToast}
            />
          </div>
        ))}
      </div>
    </div>,
    document.body,
  );
};
