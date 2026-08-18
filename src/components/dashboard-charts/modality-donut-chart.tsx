import type { IDashboardModalityStat } from "@/src/features/dashboard/hooks/use-dashboard-stats";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

interface Props {
  modalityBreakdown?: IDashboardModalityStat[];
}

const MODALITY_COLORS = ["#a855f7", "#60a5fa"];

export default function ModalityDonutChart({ modalityBreakdown = [] }: Props) {
  const items = modalityBreakdown;
  const totalCount = items.reduce((acc, curr) => acc + (curr.count ?? 0), 0);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <span className="text-xs font-bold uppercase tracking-wider text-grays-200">
          Modalidades de Mesas & Eventos
        </span>
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-white/50">
          Total: {totalCount.toLocaleString()}
        </span>
      </div>

      {items.length === 0 ? (
        <div className="flex h-32 items-center justify-center text-xs font-bold text-grays-200">
          Nenhuma modalidade registrada.
        </div>
      ) : (
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="h-32 w-32">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--tf-chart-tooltip-bg)",
                    borderColor: "var(--tf-chart-tooltip-border)",
                    borderRadius: "12px",
                    color: "var(--tf-chart-tooltip-text)",
                    fontSize: "12px",
                    fontWeight: "bold",
                  }}
                  itemStyle={{ color: "var(--tf-chart-tooltip-text)" }}
                  labelStyle={{ color: "var(--tf-chart-tooltip-text)" }}
                  formatter={(val: unknown) => [`${val}%`, "Proporção"]}
                />
                <Pie
                  data={items}
                  dataKey="percentage"
                  nameKey="modality"
                  cx="50%"
                  cy="50%"
                  innerRadius={38}
                  outerRadius={58}
                  paddingAngle={4}
                  stroke="none"
                >
                  {items.map((_, index) => (
                    <Cell key={index} fill={MODALITY_COLORS[index % MODALITY_COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex w-full flex-col gap-2.5 sm:w-auto">
            {items.map((item, idx) => {
              const color = MODALITY_COLORS[idx % MODALITY_COLORS.length];
              return (
                <div key={item.modality || idx} className="flex items-center justify-between gap-4 text-xs font-bold">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
                    <span className="text-white/80">{item.modality || "Outro"}</span>
                  </div>
                  <span className="font-mono text-white">{item.percentage}%</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
