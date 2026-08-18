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

export interface IDashboardModalityStat {
  modality: string;
  count: number;
  percentage: number;
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
  totalSpaceBookings: number;
  pendingSpaceBookings: number;
  totalCharacters: number;
  averageUserRating: number;
  pendingUserFeedbacks: number;
  popularSystems: IDashboardSystemStat[];
  userTypeBreakdown: IDashboardUserTypeStat[];
  modalityBreakdown: IDashboardModalityStat[];
  activityTrends: IDashboardActivityTrend[];
}

const EMPTY_STATS: IDashboardStats = {
  totalCampaigns: 0,
  activeCampaigns: 0,
  totalEvents: 0,
  upcomingEvents: 0,
  totalUsers: 0,
  newUsersThisMonth: 0,
  totalSystems: 0,
  totalSpaces: 0,
  totalConfirmedAttendees: 0,
  totalSpaceBookings: 0,
  pendingSpaceBookings: 0,
  totalCharacters: 0,
  averageUserRating: 0,
  pendingUserFeedbacks: 0,
  popularSystems: [],
  userTypeBreakdown: [],
  modalityBreakdown: [],
  activityTrends: [],
};

export function useDashboardStats(days: number = 7) {
  const query = useQuery({
    queryKey: ["dashboard-stats", days],
    queryFn: async () => {
      const response = await api.get<IDashboardStats>("/Dashboard", {
        params: { days },
      });
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  return {
    stats: query.data ?? EMPTY_STATS,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
}
