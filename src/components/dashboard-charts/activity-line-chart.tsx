import { useState } from "react";
import { IDashboardActivityTrend } from "@/src/features/dashboard/hooks/use-dashboard-stats";

interface Props {
  trends?: IDashboardActivityTrend[];
}

const DEFAULT_POINTS: IDashboardActivityTrend[] = [
  { label: "Seg", campaigns: 12, events: 5, users: 24 },
  { label: "Ter", campaigns: 18, events: 8, users: 31 },
  { label: "Qua", campaigns: 15, events: 12, users: 40 },
  { label: "Qui", campaigns: 22, events: 10, users: 38 },
  { label: "Sex", campaigns: 30, events: 19, users: 55 },
  { label: "Sáb", campaigns: 42, events: 28, users: 78 },
  { label: "Dom", campaigns: 38, events: 24, users: 70 },
];

export default function ActivityLineChart({ trends }: Props) {
  const [period, setPeriod] = useState<"7d" | "30d" | "90d">("7d");
  const [activeSeries, setActiveSeries] = useState<"campaigns" | "events" | "users">("campaigns");

  const points = trends && trends.length > 0 ? trends : DEFAULT_POINTS;
  const maxValue = Math.max(...points.map((p) => Math.max(p.campaigns, p.events, p.users)), 1);

  const getCoordinates = (seriesKey: "campaigns" | "events" | "users") => {
    const width = 500;
    const height = 180;
    const padding = 20;

    return points.map((p, index) => {
      const x = padding + (index / Math.max(points.length - 1, 1)) * (width - padding * 2);
      const val = p[seriesKey];
      const y = height - padding - (val / maxValue) * (height - padding * 2);
      return { x, y, val, label: p.label };
    });
  };

  const currentCoords = getCoordinates(activeSeries);

  const buildSvgPath = (coords: { x: number; y: number }[]) => {
    return coords.reduce((acc, point, index) => {
      return index === 0 ? `M ${point.x},${point.y}` : `${acc} L ${point.x},${point.y}`;
    }, "");
  };

  const buildAreaPath = (coords: { x: number; y: number }[]) => {
    if (!coords.length) return "";
    const linePath = buildSvgPath(coords);
    const lastX = coords[coords.length - 1].x;
    const firstX = coords[0].x;
    return `${linePath} L ${lastX},180 L ${firstX},180 Z`;
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Controls Header */}
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

        {/* Period Filter Toggle */}
        <div className="flex items-center gap-1 rounded-full border border-white/10 bg-black/40 p-1">
          {(["7d", "30d", "90d"] as const).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setPeriod(item)}
              className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase transition ${
                period === item
                  ? "bg-white/20 text-white shadow-xs"
                  : "text-white/50 hover:text-white"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Responsive Area & Line Chart */}
      <div className="relative h-48 w-full">
        <svg viewBox="0 0 500 180" className="h-full w-full overflow-visible">
          <defs>
            <linearGradient id="gradient-secondary" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ff2400" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#ff2400" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="gradient-amber" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="gradient-emerald" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line x1="20" y1="30" x2="480" y2="30" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />
          <line x1="20" y1="80" x2="480" y2="80" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />
          <line x1="20" y1="130" x2="480" y2="130" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />

          {/* Area Fill */}
          <path
            d={buildAreaPath(currentCoords)}
            fill={
              activeSeries === "campaigns"
                ? "url(#gradient-secondary)"
                : activeSeries === "events"
                  ? "url(#gradient-amber)"
                  : "url(#gradient-emerald)"
            }
          />

          {/* Stroke Path */}
          <path
            d={buildSvgPath(currentCoords)}
            fill="none"
            stroke={
              activeSeries === "campaigns"
                ? "#ff2400"
                : activeSeries === "events"
                  ? "#f59e0b"
                  : "#10b981"
            }
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data Points */}
          {currentCoords.map((pt, idx) => (
            <g key={idx} className="group cursor-pointer">
              <circle
                cx={pt.x}
                cy={pt.y}
                r="4"
                className={`transition-all duration-200 group-hover:r-6 ${
                  activeSeries === "campaigns"
                    ? "fill-secondary stroke-white stroke-2"
                    : activeSeries === "events"
                      ? "fill-amber-400 stroke-white stroke-2"
                      : "fill-emerald-400 stroke-white stroke-2"
                }`}
              />
              <text
                x={pt.x}
                y={pt.y - 10}
                textAnchor="middle"
                className="fill-white text-[10px] font-bold opacity-0 transition-opacity group-hover:opacity-100"
              >
                {pt.val}
              </text>
            </g>
          ))}
        </svg>

        {/* X Axis Labels */}
        <div className="mt-2 flex justify-between px-2 text-[10px] font-extrabold uppercase text-white/50">
          {points.map((p, i) => (
            <span key={i}>{p.label}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
