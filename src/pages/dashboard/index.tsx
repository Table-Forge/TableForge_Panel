import { useAuth } from "@/src/context/use-auth";
import { useDashboardStats } from "@/src/features/dashboard/hooks/use-dashboard-stats";
import {
  FileText,
  Gamepad2,
  ScrollText,
  ShieldUser,
  CalendarDays,
  ArrowUpRight,
  Sparkles,
  Swords,
  TrendingUp,
  Activity,
  Users,
  Store,
  UserCheck,
  Star,
  MapPin,
  MessageSquare,
} from "lucide-react";
import { lazy, Suspense, useMemo, useState } from "react";
import { Link } from "react-router-dom";

// Dynamic Lazy Imports for Chart Components
const ActivityLineChart = lazy(
  () => import("@/src/components/dashboard-charts/activity-line-chart")
);
const SystemsBarChart = lazy(
  () => import("@/src/components/dashboard-charts/systems-bar-chart")
);
const StatusDonutChart = lazy(
  () => import("@/src/components/dashboard-charts/status-donut-chart")
);
const ModalityDonutChart = lazy(
  () => import("@/src/components/dashboard-charts/modality-donut-chart")
);

function ChartSkeleton() {
  return (
    <div className="flex h-44 w-full animate-pulse flex-col justify-between rounded-2xl bg-white/5 p-4">
      <div className="flex items-center justify-between">
        <div className="h-4 w-32 rounded bg-white/10" />
        <div className="h-3 w-16 rounded bg-white/10" />
      </div>
      <div className="h-28 w-full rounded-xl bg-white/5" />
    </div>
  );
}

function KpiSkeleton() {
  return (
    <div className="flex h-32 w-full animate-pulse flex-col justify-between rounded-3xl border border-white/10 bg-primary/40 p-5 backdrop-blur-md">
      <div className="flex items-center justify-between">
        <div className="h-10 w-10 rounded-2xl bg-white/10" />
        <div className="h-7 w-7 rounded-full bg-white/10" />
      </div>
      <div className="mt-4 space-y-2">
        <div className="h-3 w-16 rounded bg-white/10" />
        <div className="h-6 w-24 rounded bg-white/10" />
      </div>
    </div>
  );
}

export function DashboardPage() {
  const { user } = useAuth();
  const [activityDays, setActivityDays] = useState<number>(7);
  const { stats, isLoading } = useDashboardStats(activityDays);

  const kpis = useMemo(
    () => [
      {
        title: "Campanhas",
        value: (stats.totalCampaigns ?? 0).toLocaleString(),
        growth: `${stats.activeCampaigns ?? 0} ativas`,
        tag: "Total de Mesas",
        icon: ScrollText,
        to: "/campaigns",
        accent: "border-secondary/40 bg-secondary/15 text-secondary-light",
      },
      {
        title: "Eventos",
        value: (stats.totalEvents ?? 0).toLocaleString(),
        growth: `${stats.upcomingEvents ?? 0} próximos`,
        tag: "Agenda de Eventos",
        icon: CalendarDays,
        to: "/events",
        accent: "border-amber-500/40 bg-amber-500/15 text-amber-400",
      },
      {
        title: "Reservas de Espaço",
        value: (stats.totalSpaceBookings ?? 0).toLocaleString(),
        growth: `${stats.pendingSpaceBookings ?? 0} pendentes`,
        tag: "Mesas em Lojas",
        icon: Store,
        to: "/spaces",
        accent: "border-blue-500/40 bg-blue-500/15 text-blue-400",
      },
      {
        title: "Fichas Criadas",
        value: (stats.totalCharacters ?? 0).toLocaleString(),
        growth: "Personagens no App",
        tag: "Engajamento",
        icon: UserCheck,
        to: "/classes",
        accent: "border-cyan-500/40 bg-cyan-500/15 text-cyan-400",
      },
      {
        title: "Sistemas",
        value: (stats.totalSystems ?? 0).toLocaleString(),
        growth: "Regras disponíveis",
        tag: "Compêndio RPG",
        icon: Gamepad2,
        to: "/gamesystems",
        accent: "border-purple-500/40 bg-purple-500/15 text-purple-400",
      },
      {
        title: "Usuários",
        value: (stats.totalUsers ?? 0).toLocaleString(),
        growth: `+${stats.newUsersThisMonth ?? 0} este mês`,
        tag: "Comunidade",
        icon: ShieldUser,
        to: "/users",
        accent: "border-emerald-500/40 bg-emerald-500/15 text-emerald-400",
      },
    ],
    [stats]
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
        title: "Sistemas RPG",
        description: "Cadastre e edite os sistemas RPG disponíveis no aplicativo.",
        to: "/gamesystems",
        icon: Gamepad2,
      },
      {
        title: "Classes e Raças",
        description: "Mantenha o compêndio de regras de personagens atualizado.",
        to: "/classes",
        icon: Swords,
      },
      {
        title: "Logs de Auditoria",
        description: "Consulte registros de segurança e requisições HTTP.",
        to: "/logs",
        icon: FileText,
      },
    ],
    []
  );

  return (
    <div className="space-y-6">
      {/* Top Welcome Banner Bento */}
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-primary/80 via-primary/60 to-secondary/15 p-6 lg:p-8 backdrop-blur-md shadow-2xl">
        <div className="absolute right-0 top-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-secondary/15 blur-3xl" />
        <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-secondary/30 bg-secondary/15 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-white">
              <Sparkles size={12} className="text-secondary" />
              Dashboard Analítico em Tempo Real
            </div>
            <h1 className="mt-3 text-2xl font-black uppercase tracking-tight text-white md:text-3xl">
              Boas-vindas, {user?.nickname ?? user?.username ?? "Aventureiro"}
            </h1>
            <p className="mt-1 max-w-xl text-xs text-grays-100 md:text-sm leading-relaxed">
              Métricas reais consolidadas diretamente da API backend do TableForge.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="rounded-2xl border border-white/10 bg-background/50 px-4 py-2.5 text-right backdrop-blur-xs shadow-md">
              <p className="text-[10px] font-bold uppercase tracking-widest text-grays-200">
                Função de Acesso
              </p>
              <p className="text-xs font-bold text-white uppercase">
                {user?.type ?? "Administrador"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Realtime KPI Bento Cards Row */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => <KpiSkeleton key={i} />)
          : kpis.map((kpi) => (
              <Link
                key={kpi.title}
                to={kpi.to}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-primary/60 p-5 backdrop-blur-md transition-all duration-200 hover:-translate-y-1 hover:border-secondary/50 hover:bg-primary/80 hover:shadow-[0_12px_30px_rgba(255,36,0,0.15)] flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-2xl border ${kpi.accent}`}
                  >
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
                  <div className="flex items-baseline justify-between mt-1">
                    <p className="text-2xl font-extrabold text-white">
                      {kpi.value}
                    </p>
                    <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                      <TrendingUp size={12} />
                      {kpi.growth}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
      </section>

      {/* Dynamic Lazy-Loaded Charts Section */}
      <section className="grid gap-4 lg:grid-cols-3">
        {/* Left 2 Cols: Activity Line Chart */}
        <div className="rounded-3xl border border-white/10 bg-primary/40 p-6 backdrop-blur-md shadow-2xl flex flex-col justify-between lg:col-span-2">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-secondary/20 text-secondary">
                <Activity size={18} />
              </div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                Engajamento & Atividades do Ecossistema
              </h2>
            </div>
          </div>

          {isLoading ? (
            <ChartSkeleton />
          ) : (
            <Suspense fallback={<ChartSkeleton />}>
              <ActivityLineChart
                trends={stats.activityTrends}
                period={activityDays}
                onPeriodChange={setActivityDays}
              />
            </Suspense>
          )}
        </div>

        {/* Right Col: Systems Distribution Bar Chart */}
        <div className="rounded-3xl border border-white/10 bg-primary/40 p-6 backdrop-blur-md shadow-2xl flex flex-col justify-between">
          {isLoading ? (
            <ChartSkeleton />
          ) : (
            <Suspense fallback={<ChartSkeleton />}>
              <SystemsBarChart systems={stats.popularSystems} />
            </Suspense>
          )}
        </div>
      </section>

      {/* Community & Modality Donut Charts + Feedback Summary Row */}
      <section className="grid gap-4 lg:grid-cols-3">
        {/* Donut Chart: Community Profiles */}
        <div className="rounded-3xl border border-white/10 bg-primary/40 p-6 backdrop-blur-md shadow-2xl flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
              <Users size={18} />
            </div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">
              Demografia da Comunidade
            </h2>
          </div>

          {isLoading ? (
            <ChartSkeleton />
          ) : (
            <Suspense fallback={<ChartSkeleton />}>
              <StatusDonutChart
                userTypes={stats.userTypeBreakdown}
                totalUsers={stats.totalUsers}
              />
            </Suspense>
          )}
        </div>

        {/* Donut Chart: Modality (Presencial vs Online) */}
        <div className="rounded-3xl border border-white/10 bg-primary/40 p-6 backdrop-blur-md shadow-2xl flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-500/20 text-purple-400">
              <MapPin size={18} />
            </div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">
              Modalidades de Jogo
            </h2>
          </div>

          {isLoading ? (
            <ChartSkeleton />
          ) : (
            <Suspense fallback={<ChartSkeleton />}>
              <ModalityDonutChart modalityBreakdown={stats.modalityBreakdown} />
            </Suspense>
          )}
        </div>

        {/* Satisfaction & Support Feedbacks Card */}
        <div className="rounded-3xl border border-white/10 bg-primary/40 p-6 backdrop-blur-md shadow-2xl flex flex-col justify-between">
          {isLoading ? (
            <ChartSkeleton />
          ) : (
            <>
              <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400">
                    <Star size={18} />
                  </div>
                  <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-grays-200">
                    Satisfação & Qualidade
                  </h2>
                </div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400 flex items-center gap-1">
                  <Star size={12} fill="currentColor" /> {stats.averageUserRating ?? 0} / 5.0
                </span>
              </div>

              <div className="space-y-3 my-auto">
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xs">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/15 text-amber-400">
                      <Star size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-extrabold uppercase tracking-wide text-white">
                        Avaliação Média
                      </p>
                      <p className="text-[11px] text-grays-100">
                        Experiência dos jogadores no App
                      </p>
                    </div>
                  </div>
                  <span className="text-lg font-black text-amber-400">
                    {stats.averageUserRating ?? 0}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xs">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary/15 text-secondary">
                      <MessageSquare size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-extrabold uppercase tracking-wide text-white">
                        Feedbacks Pendentes
                      </p>
                      <p className="text-[11px] text-grays-100">
                        Sugestões e relatos de bugs
                      </p>
                    </div>
                  </div>
                  <span className="text-lg font-black text-white">
                    {stats.pendingUserFeedbacks ?? 0}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Quick Action Shortcuts Grid */}
      <section className="rounded-3xl border border-white/10 bg-primary/40 p-6 backdrop-blur-md shadow-2xl flex flex-col justify-between">
        <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-3">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-grays-200">
            Atalhos Rápidos de Gestão
          </h2>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-white/50">
            Acesso Direto
          </span>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {quickCards.map((card) => (
            <Link
              key={card.title}
              to={card.to}
              className="group relative flex flex-col justify-between rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xs transition-all duration-200 hover:border-secondary/50 hover:bg-white/10 hover:shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary/15 text-secondary group-hover:bg-secondary group-hover:text-white transition-colors">
                    <card.icon size={18} />
                  </div>
                  <ArrowUpRight
                    size={14}
                    className="text-white/40 group-hover:text-white transition-colors"
                  />
                </div>

                <h3 className="mt-3 text-xs font-extrabold uppercase tracking-wide text-white">
                  {card.title}
                </h3>
                <p className="mt-1 text-[11px] text-grays-100 line-clamp-2 leading-relaxed">
                  {card.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}


