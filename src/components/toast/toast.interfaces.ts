type ToastType = "success" | "error" | "info";

interface IToast {
  id: number;
  type: ToastType;
  message: string;
}

interface ToastProps {
  id: number;
  type: ToastType;
  message: string;
  onClose: (id: number) => void;
}

export type { IToast, ToastProps, ToastType };
