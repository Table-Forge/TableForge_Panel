import { IDashboardUserTypeStat } from "@/src/features/dashboard/hooks/use-dashboard-stats";

interface Props {
  userTypes?: IDashboardUserTypeStat[];
  totalUsers?: number;
}

const DEFAULT_TYPES: IDashboardUserTypeStat[] = [
  { type: "Jogadores", count: 850, percentage: 68 },
  { type: "Mestres / Organizadores", count: 240, percentage: 20 },
  { type: "Administradores", count: 150, percentage: 12 },
];

const COLORS_LIST = [
  { text: "text-emerald-400", bg: "bg-emerald-400", hex: "#10b981" },
  { text: "text-secondary", bg: "bg-secondary", hex: "#ff2400" },
  { text: "text-amber-400", bg: "bg-amber-400", hex: "#f59e0b" },
];

export default function StatusDonutChart({ userTypes, totalUsers = 1240 }: Props) {
  const items = userTypes && userTypes.length > 0 ? userTypes : DEFAULT_TYPES;

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

      <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
        {/* SVG Donut Visual */}
        <div className="relative flex h-32 w-32 items-center justify-center">
          <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 36 36">
            <circle
              cx="18"
              cy="18"
              r="15.915"
              fill="transparent"
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="3.5"
            />
            {items.map((item, idx) => {
              const colorInfo = COLORS_LIST[idx % COLORS_LIST.length];
              const pct = Math.max(item.percentage, 2);
              const strokeDasharray = `${pct} ${100 - pct}`;
              const prevPctSum = items
                .slice(0, idx)
                .reduce((acc, curr) => acc + curr.percentage, 0);
              const strokeDashoffset = -prevPctSum;

              return (
                <circle
                  key={item.type}
                  cx="18"
                  cy="18"
                  r="15.915"
                  fill="transparent"
                  stroke={colorInfo.hex}
                  strokeWidth="3.5"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-base font-extrabold text-white">
              {totalUsers > 1000 ? `${(totalUsers / 1000).toFixed(1)}k` : totalUsers}
            </span>
            <span className="text-[9px] font-bold uppercase text-grays-200">Membros</span>
          </div>
        </div>

        {/* Legend List */}
        <div className="flex w-full flex-col gap-2.5 sm:w-auto">
          {items.map((item, idx) => {
            const colorInfo = COLORS_LIST[idx % COLORS_LIST.length];
            return (
              <div key={item.type} className="flex items-center justify-between gap-4 text-xs font-bold">
                <div className="flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 rounded-full ${colorInfo.bg}`} />
                  <span className="text-white/80">{item.type}</span>
                </div>
                <span className="font-mono text-white">{item.percentage}%</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
