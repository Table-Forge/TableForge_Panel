import { CheckCircle2, Info, TriangleAlert, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ButtonIcon } from "@/src/components/button-icon/button-icon";
import type { ToastProps } from "./toast.interfaces";

const DURATION = 3000;

const typeConfigs = {
  success: {
    icon: <CheckCircle2 size={16} />,
    colorClass: "text-green-400",
    bgClass: "bg-primary",
    borderClass: "border-green-500/30",
    barClass: "bg-green-400",
    title: "Sucesso",
  },
  error: {
    icon: <TriangleAlert size={16} />,
    colorClass: "text-danger",
    bgClass: "bg-primary",
    borderClass: "border-danger/40",
    barClass: "bg-danger",
    title: "Erro",
  },
  info: {
    icon: <Info size={16} />,
    colorClass: "text-secondary",
    bgClass: "bg-primary",
    borderClass: "border-secondary/40",
    barClass: "bg-secondary",
    title: "Informação",
  },
};

export const Toast: React.FC<ToastProps> = ({ id, type, message, onClose }) => {
  const [progress, setProgress] = useState(100);
  const timeoutRef = useRef<number | null>(null);
  const intervalRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  const remainingRef = useRef<number>(DURATION);

  const clearTimers = () => {
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    if (intervalRef.current) window.clearInterval(intervalRef.current);
  };

  const startTimer = () => {
    startTimeRef.current = Date.now();
    timeoutRef.current = window.setTimeout(
      () => onClose(id),
      remainingRef.current,
    );
    intervalRef.current = window.setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const remaining = Math.max(0, remainingRef.current - elapsed);
      setProgress((remaining / DURATION) * 100);
    }, 50);
  };

  const pauseTimer = () => {
    clearTimers();
    remainingRef.current -= Date.now() - startTimeRef.current;
  };

  useEffect(() => {
    startTimer();
    return clearTimers;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const config = typeConfigs[type];

  return (
    <div
      onMouseEnter={pauseTimer}
      onMouseLeave={startTimer}
      className={`relative min-w-50 max-w-65 overflow-hidden rounded-lg z-9999 border p-2 shadow-xl ${config.bgClass} ${config.borderClass}`}
    >
      <div className="flex items-start gap-2">
        <div className={config.colorClass}>{config.icon}</div>
        <div className="flex-1">
          <p className="text-[9px] font-bold uppercase tracking-widest text-grays-100">
            {config.title}
          </p>
          <p className="text-xs font-semibold text-white">{message}</p>
        </div>
        <ButtonIcon
          onClick={() => onClose(id)}
          aria-label="Fechar notificação"
          size="20px"
          className="text-white/70 hover:text-white"
        >
          <X size={13} />
        </ButtonIcon>
      </div>

      <div className="absolute bottom-0 left-0 h-0.5 w-full bg-white/10">
        <div
          className={`h-full ${config.barClass}`}
          style={{ width: `${progress}%`, transition: "width 50ms linear" }}
        />
      </div>
    </div>
  );
};
