import type { TSelectOptions } from "@/src/components/select/select.interfaces";
import { handleError } from "@/src/utils/error-handler";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { SPACE_KEYS } from "../query-key";
import { SpaceService } from "../../services/spaces.services";

const ENUM_GC_TIME = 1000 * 60 * 60 * 24;

export const useSpaceStatusEnum = (enabled = true) => {
  const statusEnumQuery = useQuery({
    queryKey: SPACE_KEYS.spaceStatusEnum(),
    queryFn: () => SpaceService.getSpaceStatusEnum(),
    enabled,
    staleTime: Infinity,
    gcTime: ENUM_GC_TIME,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (statusEnumQuery.error) {
      handleError(statusEnumQuery.error as Error);
    }
  }, [statusEnumQuery.error]);

  return {
    statusEnum: (statusEnumQuery.data ?? []) as TSelectOptions[],
    isLoadingStatusEnum: statusEnumQuery.isPending,
    statusEnumQuery,
  };
};

export const useTableShapeEnum = (enabled = true) => {
  const shapeEnumQuery = useQuery({
    queryKey: SPACE_KEYS.tableShapeEnum(),
    queryFn: () => SpaceService.getTableShapeEnum(),
    enabled,
    staleTime: Infinity,
    gcTime: ENUM_GC_TIME,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (shapeEnumQuery.error) {
      handleError(shapeEnumQuery.error as Error);
    }
  }, [shapeEnumQuery.error]);

  return {
    shapeEnum: (shapeEnumQuery.data ?? []) as TSelectOptions[],
    isLoadingShapeEnum: shapeEnumQuery.isPending,
    shapeEnumQuery,
  };
};

export const useBookingStatusEnum = (enabled = true) => {
  const statusEnumQuery = useQuery({
    queryKey: SPACE_KEYS.bookingStatusEnum(),
    queryFn: () => SpaceService.getBookingStatusEnum(),
    enabled,
    staleTime: Infinity,
    gcTime: ENUM_GC_TIME,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (statusEnumQuery.error) {
      handleError(statusEnumQuery.error as Error);
    }
  }, [statusEnumQuery.error]);

  return {
    statusEnum: (statusEnumQuery.data ?? []) as TSelectOptions[],
    isLoadingStatusEnum: statusEnumQuery.isPending,
    statusEnumQuery,
  };
};
