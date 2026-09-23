import { Card } from "@/src/components/card/card";
import { CrmPageHeader } from "@/src/components/crm-page-header/crm-page-header";
import { KeystoneIcon } from "@/src/components/icons/icons";
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
        <Card padding="none" className="p-5">
          <h3 className="mb-4 flex items-center gap-2.5 font-display text-sm font-bold uppercase tracking-[0.06em] text-white">
            <KeystoneIcon className="h-3 w-3 shrink-0 text-accent" aria-hidden="true" />
            Por Situação
          </h3>
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
        </Card>

        {/* Category Distribution */}
        <Card padding="none" className="p-5">
          <h3 className="mb-4 flex items-center gap-2.5 font-display text-sm font-bold uppercase tracking-[0.06em] text-white">
            <KeystoneIcon className="h-3 w-3 shrink-0 text-accent" aria-hidden="true" />
            Por Assunto
          </h3>
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
        </Card>
      </div>
    </>
  );
}
