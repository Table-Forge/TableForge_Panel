import type { ReactNode } from "react";
import { Button } from "@/src/components/button/button";

export interface IKpiStat {
  title: string;
  value: string | number;
  badge?: string;
  badgeType?: "success" | "warning" | "danger" | "neutral";
  icon?: ReactNode;
}

interface ICrmPageHeaderProps {
  title: string;
  subtitle?: string;
  count?: number;
  stats?: IKpiStat[];
  actionLabel?: string;
  actionIcon?: ReactNode;
  onActionClick?: () => void;
  extraActions?: ReactNode;
}

export function CrmPageHeader({
  title,
  subtitle,
  count,
  stats,
  actionLabel,
  actionIcon,
  onActionClick,
  extraActions,
}: ICrmPageHeaderProps) {
  return (
    <div className="flex flex-col gap-5">
      {/* Top Header Row */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold uppercase tracking-tight text-white">
              {title}
            </h1>
            {count !== undefined ? (
              <span className="inline-flex items-center rounded-full border border-white/10 bg-white/10 px-3 py-0.5 text-xs font-extrabold tracking-wide text-white/90 shadow-xs">
                {count}
              </span>
            ) : null}
          </div>
          {subtitle ? (
            <p className="text-sm text-grays-100">{subtitle}</p>
          ) : null}
        </div>

        <div className="flex items-center gap-3">
          {extraActions}
          {actionLabel && onActionClick ? (
            <Button
              buttonStyle="primary"
              size="sm"
              onClick={onActionClick}
              className="!rounded-2xl shadow-lg hover:shadow-secondary/20"
            >
              {actionIcon}
              {actionLabel}
            </Button>
          ) : null}
        </div>
      </div>

      {/* KPI Stats Cards Row (if present) */}
      {stats && stats.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-primary/40 p-4 transition-all duration-200 hover:border-white/20 hover:bg-primary/60 hover:shadow-lg"
            >
              <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-grays-200">
                <span>{stat.title}</span>
                {stat.icon ? (
                  <span className="text-white/60 transition-colors group-hover:text-secondary">
                    {stat.icon}
                  </span>
                ) : null}
              </div>

              <div className="mt-2 flex items-baseline justify-between gap-2">
                <span className="text-2xl font-extrabold tracking-tight text-white">
                  {stat.value}
                </span>

                {stat.badge ? (
                  <span
                    className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold ${
                      stat.badgeType === "success"
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        : stat.badgeType === "warning"
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                          : stat.badgeType === "danger"
                            ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                            : "bg-white/10 text-white/80 border border-white/15"
                    }`}
                  >
                    {stat.badge}
                  </span>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
