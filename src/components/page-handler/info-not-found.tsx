import { useNavigate } from "react-router-dom";
import { CircleHelp } from "lucide-react";
import { Button } from "@/src/components/button/button";

interface InfoNotFoundProps {
  message?: string;
}

export function InfoNotFound({ message }: InfoNotFoundProps = {}) {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[60vh] flex-1 flex-col items-center justify-center gap-6 p-6 text-center">
      <div className="text-tertiary">
        <CircleHelp size={58} />
      </div>

      <h1 className="text-2xl font-bold uppercase text-white md:text-4xl">Conteúdo Não Encontrado</h1>

      <p className="max-w-[520px] text-sm text-grays-100 md:text-base">
        {message || "O conteúdo que você tentou acessar nessa página não foi encontrado."}
      </p>

      <Button type="button" onClick={() => navigate(-1)} className="min-w-[140px]">
        Voltar
      </Button>
    </div>
  );
}
