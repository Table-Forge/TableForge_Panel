import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldBan } from "lucide-react";
import { Button } from "@/src/components/button/button";

interface UnauthorizedProps {
  onForceLogout?: () => void;
  countdownSeconds?: number;
}

export function Unauthorized({ onForceLogout, countdownSeconds = 60 }: UnauthorizedProps) {
  const [timeRemaining, setTimeRemaining] = useState(countdownSeconds);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTimeRemaining((prev) => prev - 1);
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (timeRemaining <= 0) {
      onForceLogout?.();
    }
  }, [onForceLogout, timeRemaining]);

  return (
    <div className="flex min-h-[70vh] flex-1 flex-col items-center justify-center gap-6 p-6 text-center">
      <div className="text-tertiary">
        <ShieldBan size={58} />
      </div>

      <h1 className="text-2xl font-bold uppercase text-white md:text-4xl">Página Bloqueada</h1>

      <p className="max-w-[560px] text-sm text-grays-100 md:text-base">
        Você não tem permissão para acessar esta página. Retornaremos ao login em{" "}
        <b className="font-mono text-tertiary">{timeRemaining}s</b>.
      </p>

      <div className="mt-2 flex items-center justify-center gap-3">
        <Button type="button" buttonStyle="hollow" onClick={() => navigate(-1)} className="min-w-[140px]">
          Voltar
        </Button>
        <Button type="button" buttonStyle="danger" onClick={() => onForceLogout?.()} className="min-w-[140px]">
          Sair Agora
        </Button>
      </div>
    </div>
  );
}
