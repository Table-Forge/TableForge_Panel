import { useAuth } from "@/src/context/use-auth";
import {
  FileText,
  Gamepad2,
  LayoutGrid,
  ScrollText,
  ShieldUser,
} from "lucide-react";
import { useMemo } from "react";
import { Link } from "react-router-dom";

export function DashboardPage() {
  const { user } = useAuth();

  const quickCards = useMemo(
    () => [
      {
        title: "Campanhas",
        description: "Gerencie campanhas, descrições e publicações do aplicativo.",
        to: "/campaigns",
        icon: ScrollText,
      },
      {
        title: "Sistemas de Jogo",
        description: "Cadastre os sistemas usados nas campanhas.",
        to: "/gamesystems",
        icon: Gamepad2,
      },
      {
        title: "Usuários",
        description: "Acompanhe e edite os dados dos usuários cadastrados.",
        to: "/users",
        icon: ShieldUser,
      },
      {
        title: "Resumo",
        description: "Visão geral das operações do painel administrativo.",
        to: "/",
        icon: LayoutGrid,
      },
      {
        title: "Logs",
        description: "Consulte logs de execução e erros do sistema.",
        to: "/logs",
        icon: FileText,
      },
    ],
    [],
  );

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-secondary/25 bg-primary/70 p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-grays-100">
          Boas-vindas
        </p>
        <h2 className="mt-3 text-2xl font-black uppercase tracking-tight text-white">
          Painel do TableForge
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-grays-100">
          {`Administrador: ${user?.nickname ?? user?.username ?? "Usuário"}.`}{" "}
          Use os atalhos abaixo para gerenciar o conteúdo do TableForge.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {quickCards.map((card) => (
          <Link
            key={card.title}
            to={card.to}
            className="group rounded-2xl border border-tertiary/25 bg-primary/80 p-5 transition hover:-translate-y-0.5 hover:border-tertiary/55 hover:shadow-[0_16px_40px_rgba(0,0,0,0.32)]"
          >
            <card.icon className="text-tertiary" size={24} />
            <h3 className="mt-4 text-lg font-bold uppercase tracking-wide text-white">
              {card.title}
            </h3>
            <p className="mt-2 text-sm text-grays-100">{card.description}</p>
            <span className="mt-4 inline-block text-xs font-semibold uppercase tracking-[0.16em] text-secondary group-hover:text-white">
              Acessar
            </span>
          </Link>
        ))}
      </section>
    </div>
  );
}

