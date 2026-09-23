import type { ReactNode } from "react";
import { Button } from "@/src/components/button/button";
import { Card } from "@/src/components/card/card";
import { KeystoneIcon } from "@/src/components/icons/icons";

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
            <KeystoneIcon className="h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
            <h1 className="font-display text-2xl font-bold uppercase tracking-[0.04em] text-white">
              {title}
            </h1>
            {count !== undefined ? (
              <span className="inline-flex items-center chamfer-sm border border-accent/40 bg-accent/15 px-2.5 py-0.5 text-xs font-bold tracking-[0.12em] text-ember">
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
            <Card
              key={idx}
              padding="sm"
              interactive
              className="group flex flex-col justify-between"
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
                <span className="font-display text-2xl font-bold text-white">
                  {stat.value}
                </span>

                {stat.badge ? (
                  <span
                    className={`inline-flex items-center chamfer-sm px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] ${
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
            </Card>
          ))}
        </div>
      ) : null}
    </div>
  );
}
