import { useState } from "react";
import type { IDashboardActivityTrend } from "@/src/features/dashboard/hooks/use-dashboard-stats";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

interface Props {
  trends?: IDashboardActivityTrend[];
  period?: number;
  onPeriodChange?: (days: number) => void;
}

export default function ActivityLineChart({ trends = [], period = 7, onPeriodChange }: Props) {
  const [activeSeries, setActiveSeries] = useState<"campaigns" | "events" | "users">("campaigns");

  const colorsMap = {
    campaigns: { stroke: "#ff2400", fill: "#ff2400" },
    events: { stroke: "#f59e0b", fill: "#f59e0b" },
    users: { stroke: "#10b981", fill: "#10b981" },
  };

  const labelsMap = {
    campaigns: "Campanhas",
    events: "Eventos",
    users: "Usuários",
  };

  const currentColor = colorsMap[activeSeries];
  const currentLabel = labelsMap[activeSeries];

  return (
    <div className="flex flex-col gap-4 select-none">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveSeries("campaigns")}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold transition ${
              activeSeries === "campaigns"
                ? "bg-secondary text-white shadow-md shadow-secondary/20"
                : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
            }`}
          >
            <span className="h-2 w-2 rounded-full bg-secondary" />
            Campanhas
          </button>
          <button
            type="button"
            onClick={() => setActiveSeries("events")}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold transition ${
              activeSeries === "events"
                ? "bg-amber-500 text-white shadow-md shadow-amber-500/20"
                : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
            }`}
          >
            <span className="h-2 w-2 rounded-full bg-amber-400" />
            Eventos
          </button>
          <button
            type="button"
            onClick={() => setActiveSeries("users")}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold transition ${
              activeSeries === "users"
                ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20"
                : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
            }`}
          >
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Usuários
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 rounded-full border border-white/10 bg-black/40 p-1">
            {([7, 30, 90] as const).map((days) => (
              <button
                key={days}
                type="button"
                onClick={() => onPeriodChange?.(days)}
                className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase transition ${
                  period === days
                    ? "bg-white/20 text-white shadow-xs"
                    : "text-white/50 hover:text-white"
                }`}
              >
                {days}d
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="h-56 w-full">
        {trends.length === 0 ? (
          <div className="flex h-full items-center justify-center text-xs font-bold text-grays-200">
            Nenhuma atividade registrada no período selecionado.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={trends}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="activeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={currentColor.fill} stopOpacity={0.4} />
                  <stop offset="95%" stopColor={currentColor.fill} stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--tf-border-subtle)" vertical={false} />
              <XAxis
                dataKey="label"
                stroke="var(--color-grays-300)"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="var(--color-grays-300)"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip
                formatter={(value) => [value ?? 0, currentLabel]}
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
              />
              <Area
                type="monotone"
                dataKey={activeSeries}
                name={currentLabel}
                stroke={currentColor.stroke}
                fill="url(#activeGradient)"
                strokeWidth={3}
                dot={{ r: 4, fill: currentColor.stroke, stroke: "#fff", strokeWidth: 2 }}
                activeDot={{ r: 6, fill: currentColor.stroke, stroke: "#fff", strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

