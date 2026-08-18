import { useAuth } from "@/src/context/use-auth";
import {
  FileText,
  Gamepad2,
  ScrollText,
  ShieldUser,
  CalendarDays,
  ArrowUpRight,
  Sparkles,
  Swords,
  Image,
} from "lucide-react";
import { useMemo } from "react";
import { Link } from "react-router-dom";

export function DashboardPage() {
  const { user } = useAuth();

  const kpis = useMemo(
    () => [
      {
        title: "Campanhas",
        value: "Ativas",
        tag: "Gestão",
        icon: ScrollText,
        to: "/campaigns",
      },
      {
        title: "Eventos",
        value: "Agenda",
        tag: "Próximos",
        icon: CalendarDays,
        to: "/events",
      },
      {
        title: "Sistemas",
        value: "Catálogo",
        tag: "Regras",
        icon: Gamepad2,
        to: "/gamesystems",
      },
      {
        title: "Usuários",
        value: "Contas",
        tag: "Acessos",
        icon: ShieldUser,
        to: "/users",
      },
    ],
    [],
  );

  const quickCards = useMemo(
    () => [
      {
        title: "Campanhas",
        description: "Gerencie campanhas, descrições e publicações do aplicativo.",
        to: "/campaigns",
        icon: ScrollText,
      },
      {
        title: "Eventos",
        description: "Organize eventos, locais, presenças e agendamentos.",
        to: "/events",
        icon: CalendarDays,
      },
      {
        title: "Sistemas de Jogo",
        description: "Cadastre e edite os sistemas RPG disponíveis.",
        to: "/gamesystems",
        icon: Gamepad2,
      },
      {
        title: "Banners",
        description: "Configure os destaques visuais do app móvel.",
        to: "/banners",
        icon: Image,
      },
      {
        title: "Classes e Raças",
        description: "Mantenha o compêndio de regras atualizado.",
        to: "/classes",
        icon: Swords,
      },
      {
        title: "Logs de Sistema",
        description: "Consulte registros de auditoria e depuração.",
        to: "/logs",
        icon: FileText,
      },
    ],
    [],
  );

  return (
    <div className="space-y-6">
      {/* Top Banner Bento */}
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-primary/80 via-primary/60 to-secondary/10 p-6 lg:p-8 backdrop-blur-md shadow-2xl">
        <div className="absolute right-0 top-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-secondary/10 blur-3xl" />
        <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-secondary/30 bg-secondary/15 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-white">
              <Sparkles size={12} className="text-secondary" />
              Painel de Controle
            </div>
            <h1 className="mt-3 text-2xl font-black uppercase tracking-tight text-white md:text-3xl">
              Boas-vindas, {user?.nickname ?? user?.username ?? "Aventureiro"}
            </h1>
            <p className="mt-1 max-w-xl text-xs text-grays-100 md:text-sm">
              Gerencie todo o ecossistema do TableForge a partir da sua central administrativa em formato Bento.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="rounded-2xl border border-white/10 bg-background/40 px-4 py-2.5 text-right backdrop-blur-xs">
              <p className="text-[10px] font-bold uppercase tracking-widest text-grays-200">
                Função
              </p>
              <p className="text-xs font-bold text-white uppercase">
                {user?.type ?? "Administrador"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* KPI Bento Grid */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <Link
            key={kpi.title}
            to={kpi.to}
            className="group relative overflow-hidden rounded-3xl border border-white/10 bg-primary/60 p-5 backdrop-blur-md transition-all duration-200 hover:-translate-y-1 hover:border-secondary/50 hover:bg-primary/80 hover:shadow-[0_12px_30px_rgba(255,36,0,0.15)]"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-secondary/30 bg-secondary/15 text-white">
                <kpi.icon size={20} />
              </div>
              <span className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-white/5 text-grays-100 transition-all duration-200 group-hover:border-secondary/40 group-hover:bg-secondary group-hover:text-white">
                <ArrowUpRight size={14} />
              </span>
            </div>

            <div className="mt-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-grays-200">
                {kpi.tag}
              </span>
              <p className="text-lg font-bold text-white uppercase">
                {kpi.title}
              </p>
            </div>
          </Link>
        ))}
      </section>

      {/* Main Modules Bento Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-grays-200">
            Módulos Principais
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {quickCards.map((card) => (
            <Link
              key={card.title}
              to={card.to}
              className="group relative flex flex-col justify-between rounded-3xl border border-white/10 bg-primary/50 p-6 backdrop-blur-md transition-all duration-200 hover:-translate-y-1 hover:border-secondary/50 hover:bg-primary/80 hover:shadow-2xl"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-secondary group-hover:border-secondary/40 group-hover:bg-secondary/15">
                    <card.icon size={24} />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-grays-200 group-hover:text-white flex items-center gap-1">
                    Acessar <ArrowUpRight size={14} />
                  </span>
                </div>

                <h3 className="mt-5 text-lg font-bold uppercase tracking-wide text-white">
                  {card.title}
                </h3>
                <p className="mt-2 text-xs text-grays-100 leading-relaxed">
                  {card.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-[11px] font-semibold text-grays-200">
                <span>Gerenciar</span>
                <span className="h-1.5 w-1.5 rounded-full bg-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

