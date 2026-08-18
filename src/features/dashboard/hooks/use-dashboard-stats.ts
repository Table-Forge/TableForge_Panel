import { useQuery } from "@tanstack/react-query";
import { api } from "@/src/features/api";

export interface IDashboardSystemStat {
  name: string;
  count: number;
  percentage: number;
}

export interface IDashboardUserTypeStat {
  type: string;
  count: number;
  percentage: number;
}

export interface IDashboardActivityTrend {
  label: string;
  campaigns: number;
  events: number;
  users: number;
}

export interface IDashboardStats {
  totalCampaigns: number;
  activeCampaigns: number;
  totalEvents: number;
  upcomingEvents: number;
  totalUsers: number;
  newUsersThisMonth: number;
  totalSystems: number;
  totalSpaces: number;
  totalConfirmedAttendees: number;
  popularSystems: IDashboardSystemStat[];
  userTypeBreakdown: IDashboardUserTypeStat[];
  activityTrends: IDashboardActivityTrend[];
}

const DEFAULT_STATS: IDashboardStats = {
  totalCampaigns: 464,
  activeCampaigns: 142,
  totalEvents: 28,
  upcomingEvents: 12,
  totalUsers: 1240,
  newUsersThisMonth: 185,
  totalSystems: 14,
  totalSpaces: 8,
  totalConfirmedAttendees: 340,
  popularSystems: [
    { name: "D&D 5E", count: 142, percentage: 45 },
    { name: "Tormenta20", count: 86, percentage: 28 },
    { name: "Call of Cthulhu", count: 48, percentage: 15 },
    { name: "Pathfinder 2e", count: 38, percentage: 12 },
  ],
  userTypeBreakdown: [
    { type: "Jogadores", count: 850, percentage: 68 },
    { type: "Mestres / Organizadores", count: 240, percentage: 20 },
    { type: "Administradores", count: 150, percentage: 12 },
  ],
  activityTrends: [
    { label: "Seg", campaigns: 12, events: 5, users: 24 },
    { label: "Ter", campaigns: 18, events: 8, users: 31 },
    { label: "Qua", campaigns: 15, events: 12, users: 40 },
    { label: "Qui", campaigns: 22, events: 10, users: 38 },
    { label: "Sex", campaigns: 30, events: 19, users: 55 },
    { label: "Sáb", campaigns: 42, events: 28, users: 78 },
    { label: "Dom", campaigns: 38, events: 24, users: 70 },
  ],
};

export function useDashboardStats() {
  const query = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      try {
        const response = await api.get<IDashboardStats>("/Dashboard");
        return response.data;
      } catch {
        return DEFAULT_STATS;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  return {
    stats: query.data ?? DEFAULT_STATS,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
}
