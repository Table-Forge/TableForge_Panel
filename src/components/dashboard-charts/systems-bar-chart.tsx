import { IDashboardSystemStat } from "@/src/features/dashboard/hooks/use-dashboard-stats";

interface Props {
  systems?: IDashboardSystemStat[];
}

const DEFAULT_SYSTEMS: IDashboardSystemStat[] = [
  { name: "D&D 5E", count: 142, percentage: 45 },
  { name: "Tormenta20", count: 86, percentage: 28 },
  { name: "Call of Cthulhu", count: 48, percentage: 15 },
  { name: "Pathfinder 2e", count: 38, percentage: 12 },
];

const COLORS = ["bg-secondary", "bg-amber-500", "bg-purple-500", "bg-emerald-500", "bg-cyan-500"];

export default function SystemsBarChart({ systems }: Props) {
  const items = systems && systems.length > 0 ? systems : DEFAULT_SYSTEMS;

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

      <div className="space-y-3">
        {items.map((sys, idx) => {
          const color = COLORS[idx % COLORS.length];
          return (
            <div key={sys.name} className="flex flex-col gap-1">
              <div className="flex items-center justify-between text-xs font-bold text-white">
                <span className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${color}`} />
                  {sys.name}
                </span>
                <span className="text-grays-100 font-mono">
                  {sys.count} ({sys.percentage}%)
                </span>
              </div>
              {/* Progress bar background */}
              <div className="h-2 w-full overflow-hidden rounded-full bg-white/5">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${color}`}
                  style={{ width: `${Math.max(sys.percentage, 5)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
