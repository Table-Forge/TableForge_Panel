import { CrmPageHeader } from "@/src/components/crm-page-header/crm-page-header";
import { useUserFeedbackSummaryQuery } from "@/src/features/user-feedbacks/hooks/use-user-feedbacks-queries";
import { Skeleton } from "@/src/components/skeleton/skeleton";

export function UserFeedbacksDashboardPage() {
  const { data: summary, isLoading, isError } = useUserFeedbackSummaryQuery();

  if (isLoading) return <div className="p-4"><Skeleton className="h-64 w-full" /></div>;
  if (isError || !summary) return <div className="p-4 text-grays-200">Erro ao carregar dashboard.</div>;

  const total = summary.total;
  const pending = summary.pending;
  const averageRating = summary.averageRating ? summary.averageRating.toFixed(2) : "-";

  return (
    <>
      <CrmPageHeader
        title="Dashboard de Feedbacks"
        subtitle="Resumo e métricas gerais dos feedbacks enviados pelos usuários."
        count={total}
        stats={[
          { title: "Total Recebidos", value: total, badge: "Geral", badgeType: "neutral" },
          { title: "Fila Pendente", value: pending, badge: "Triagem", badgeType: "warning" },
          { title: "Nota Média (Exp)", value: String(averageRating), badge: "Avaliação", badgeType: "success" },
        ]}
      />

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Status Distribution */}
        <div className="rounded-xl border border-grays-700 bg-grays-800 p-5">
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-grays-100">Por Situação</h3>
          <div className="flex flex-col gap-3">
            {summary.byStatus.map((stat) => (
              <div key={stat.value} className="flex items-center justify-between">
                <span className="text-sm text-grays-200">{stat.value}</span>
                <div className="flex items-center gap-3">
                  <div className="h-2 w-32 rounded-full bg-grays-700 overflow-hidden">
                    <div
                      className="h-full bg-secondary/80"
                      style={{ width: `${total > 0 ? (stat.total / total) * 100 : 0}%` }}
                    />
                  </div>
                  <span className="w-8 text-right text-sm font-bold text-grays-50">{stat.total}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Distribution */}
        <div className="rounded-xl border border-grays-700 bg-grays-800 p-5">
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-grays-100">Por Assunto</h3>
          <div className="flex flex-col gap-3">
            {summary.byCategory.map((stat) => (
              <div key={stat.value} className="flex items-center justify-between">
                <span className="text-sm text-grays-200">{stat.value}</span>
                <div className="flex items-center gap-3">
                  <div className="h-2 w-32 rounded-full bg-grays-700 overflow-hidden">
                    <div
                      className="h-full bg-info/80"
                      style={{ width: `${total > 0 ? (stat.total / total) * 100 : 0}%` }}
                    />
                  </div>
                  <span className="w-8 text-right text-sm font-bold text-grays-50">{stat.total}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
