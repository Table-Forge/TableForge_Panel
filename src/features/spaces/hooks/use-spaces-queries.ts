import { handleError } from "@/src/utils/error-handler";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { SpaceService } from "../services/spaces.services";
import { SPACE_KEYS } from "./query-key";

export const useAllSpaces = (params: Record<string, unknown> = {}, enabled = true) => {
  const allSpacesQuery = useQuery({
    queryKey: SPACE_KEYS.list(params),
    queryFn: () => SpaceService.getAll(params),
    enabled,
  });

  useEffect(() => {
    if (allSpacesQuery.error) {
      handleError(allSpacesQuery.error as Error);
    }
  }, [allSpacesQuery.error]);

  const spaces = useMemo(() => {
    if (!allSpacesQuery.data) return [];
    return allSpacesQuery.data.items || [];
  }, [allSpacesQuery.data]);

  return {
    spaces,
    isLoadingSpaces: allSpacesQuery.isPending,
    allSpacesQuery,
  };
};

export const useSpaceById = (id: number, enabled = true) => {
  const spaceQuery = useQuery({
    queryKey: SPACE_KEYS.detail(id),
    queryFn: () => SpaceService.getById(id),
    enabled: !!id && enabled,
  });

  useEffect(() => {
    if (spaceQuery.error) {
      handleError(spaceQuery.error as Error);
    }
  }, [spaceQuery.error]);

  return {
    space: spaceQuery.data,
    isLoadingSpace: spaceQuery.isPending,
    spaceQuery,
  };
};

export const useSpaceTables = (spaceId: number, params: Record<string, unknown> = {}, enabled = true) => {
  const tablesQuery = useQuery({
    queryKey: [...SPACE_KEYS.tables(spaceId), params],
    queryFn: () => SpaceService.getTablesBySpaceId(spaceId, params),
    enabled: !!spaceId && enabled,
  });

  useEffect(() => {
    if (tablesQuery.error) {
      handleError(tablesQuery.error as Error);
    }
  }, [tablesQuery.error]);

  return {
    tables: tablesQuery.data || [],
    isLoadingTables: tablesQuery.isPending,
    tablesQuery,
  };
};

export const useAllBookings = (params: Record<string, unknown> = {}, enabled = true) => {
  const bookingsQuery = useQuery({
    queryKey: SPACE_KEYS.bookingList(params),
    queryFn: () => SpaceService.getBookings(params),
    enabled,
  });

  return {
    data: bookingsQuery.data,
    isLoading: bookingsQuery.isPending,
    bookingsQuery,
  };
};

export const useBookingMessages = (bookingId: number) => {
  return useQuery({
    queryKey: SPACE_KEYS.bookingMessages(bookingId),
    queryFn: () => SpaceService.getBookingMessages(bookingId),
    enabled: !!bookingId,
  });
};
