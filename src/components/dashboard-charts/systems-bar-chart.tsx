import type { IDashboardSystemStat } from "@/src/features/dashboard/hooks/use-dashboard-stats";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";

interface Props {
  systems?: IDashboardSystemStat[];
}

const BAR_COLORS = ["#ff2400", "#f59e0b", "#a855f7", "#10b981", "#06b6d4"];

export default function SystemsBarChart({ systems = [] }: Props) {
  const items = systems;

  return (
    <div className="flex flex-col gap-3.5">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <span className="text-xs font-bold uppercase tracking-wider text-grays-200">
          Sistemas Mais Jogados
        </span>
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-white/50">
          Distribuição Real
        </span>
      </div>

      {items.length === 0 ? (
        <div className="flex h-36 items-center justify-center text-xs font-bold text-grays-200">
          Nenhum sistema com estatísticas registradas.
        </div>
      ) : (
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={items}
              layout="vertical"
              margin={{ top: 0, right: 10, left: 10, bottom: 0 }}
            >
              <XAxis type="number" hide />
              <YAxis
                type="category"
                dataKey="name"
                stroke="var(--color-white)"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                width={100}
              />
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
                cursor={{ fill: "var(--tf-border-subtle)" }}
                formatter={(val: unknown) => [String(val), "Mesas"]}
              />
              <Bar dataKey="count" radius={[0, 8, 8, 0]}>
                {items.map((_, index) => (
                  <Cell key={index} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
