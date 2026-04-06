import { CheckCircle2, Info, TriangleAlert, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { ToastProps } from "./toast.interfaces";

const DURATION = 3000;

const typeConfigs = {
  success: {
    icon: <CheckCircle2 size={20} />,
    colorClass: "text-green-400",
    bgClass: "bg-primary",
    borderClass: "border-green-500/30",
    barClass: "bg-green-400",
    title: "Sucesso",
  },
  error: {
    icon: <TriangleAlert size={20} />,
    colorClass: "text-danger",
    bgClass: "bg-primary",
    borderClass: "border-danger/40",
    barClass: "bg-danger",
    title: "Erro",
  },
  info: {
    icon: <Info size={20} />,
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
      className={`relative min-w-[300px] max-w-[380px] overflow-hidden rounded-2xl z-[9999] border p-3 shadow-xl ${config.bgClass} ${config.borderClass}`}
    >
      <div className="flex items-start gap-3">
        <div className={config.colorClass}>{config.icon}</div>
        <div className="flex-1">
          <p className="text-[10px] font-bold uppercase tracking-widest text-grays-100">
            {config.title}
          </p>
          <p className="text-sm font-semibold text-white">{message}</p>
        </div>
        <button
          onClick={() => onClose(id)}
          className="text-white/70 transition hover:text-white"
          aria-label="Fechar notificação"
        >
          <X size={15} />
        </button>
      </div>

      <div className="absolute bottom-0 left-0 h-[3px] w-full bg-white/10">
        <div
          className={`h-full ${config.barClass}`}
          style={{ width: `${progress}%`, transition: "width 50ms linear" }}
        />
      </div>
    </div>
  );
};
