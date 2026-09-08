import type { IDashboardUserTypeStat } from "@/src/features/dashboard/hooks/use-dashboard-stats";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

interface Props {
  userTypes?: IDashboardUserTypeStat[];
  totalUsers?: number;
}

const DONUT_COLORS = ["#10b981", "#ff2400", "#f59e0b"];

export default function StatusDonutChart({ userTypes = [], totalUsers = 0 }: Props) {
  const items = userTypes;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <span className="text-xs font-bold uppercase tracking-wider text-grays-200">
          Comunidade & Perfis
        </span>
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-white/50">
          Total: {totalUsers.toLocaleString()}
        </span>
      </div>

      {items.length === 0 ? (
        <div className="flex h-32 items-center justify-center text-xs font-bold text-grays-200">
          Nenhum perfil cadastrado.
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
                  nameKey="type"
                  cx="50%"
                  cy="50%"
                  innerRadius={38}
                  outerRadius={58}
                  paddingAngle={4}
                  stroke="none"
                >
                  {items.map((_, index) => (
                    <Cell key={index} fill={DONUT_COLORS[index % DONUT_COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex w-full flex-col gap-2.5 sm:w-auto">
            {items.map((item, idx) => {
              const color = DONUT_COLORS[idx % DONUT_COLORS.length];
              return (
                <div key={item.type || idx} className="flex items-center justify-between gap-4 text-xs font-bold">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
                    <span className="text-white/80">{item.type || "Outro"}</span>
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
